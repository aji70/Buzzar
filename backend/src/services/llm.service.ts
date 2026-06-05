import { env } from '../config/env';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';
import { QuestionType, QuestionDifficulty } from '../entities/Question';

export interface GeneratedQuestion {
  type: QuestionType;
  question: string;
  answer_options?: string[];
  answer: string;
  hint: string;
  image_url: string | null;
  difficulty: QuestionDifficulty;
  points: number;
}

export interface GenerateQuestionsOptions {
  category_id: string;
  number_of_questions: number;
  type?: QuestionType | null;
  difficulty?: QuestionDifficulty | null;
}

const DIFFICULTY_POINTS: Record<QuestionDifficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

function buildTypeInstruction(n: number, fixed?: QuestionType | null): string {
  if (fixed) return `All ${n} questions must be of type "${fixed}".`;
  const types = Object.values(QuestionType);
  const dist: Record<string, number> = {};
  types.forEach(t => (dist[t] = Math.floor(n / types.length)));
  let rem = n - types.length * Math.floor(n / types.length);
  types.sort(() => Math.random() - 0.5).forEach(t => { if (rem-- > 0) dist[t]++; });
  return `Mix question types freely. Suggested: ${dist.multichoice} multichoice, ${dist.input} input, ${dist.true_or_false} true_or_false — vary at your discretion as long as all three types appear.`;
}

async function fetchWikimediaImage(query: string): Promise<string | null> {
  const queries = [query, query.split(' ').slice(0, 2).join(' ')];

  for (const q of queries) {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(q)}&gsrlimit=10&prop=imageinfo&iiprop=url|mime&format=json&origin=*`;
    try {
      const res = await fetch(url);
      const data = await res.json() as any;
      const pages = Object.values(data?.query?.pages ?? {}) as any[];

      const image =
        pages.find(p => ['image/jpeg', 'image/png', 'image/webp'].includes(p.imageinfo?.[0]?.mime)) ??
        pages.find(p => p.imageinfo?.[0]?.url);

      const imageUrl: string = image?.imageinfo?.[0]?.url ?? '';
      if (imageUrl) return imageUrl;
    } catch { /* try next query */ }
  }

  return null;
}

export class LLMService {
  private categoryRepo = AppDataSource.getRepository(Category);

  async generateQuestions(options: GenerateQuestionsOptions): Promise<GeneratedQuestion[]> {
    const { category_id, number_of_questions, type, difficulty } = options;

    const category = await this.categoryRepo.findOne({ where: { id: category_id } });
    if (!category) throw new Error('Category not found');

    const typeInstruction = buildTypeInstruction(number_of_questions, type);
    const difficultyInstruction = difficulty
      ? `All questions must have difficulty "${difficulty}".`
      : `Assign difficulty randomly per question — freely mix "easy", "medium", and "hard".`;

    const prompt = `You are a quiz question generator. Generate exactly ${number_of_questions} quiz questions about: "${category.title}".

${typeInstruction}
${difficultyInstruction}

Rules:
- "multichoice": answer_options is an array of exactly 4 strings; answer must be one of them.
- "true_or_false": answer is exactly "true" or "false"; omit answer_options.
- "input": answer is a short text; omit answer_options.
- hint: helpful clue that does not reveal the answer.
- difficulty: "easy", "medium", or "hard".
- points: 1 for easy, 2 for medium, 3 for hard.
- image_search: a short 2-4 word Wikimedia Commons search term for a relevant image (e.g. "Sweden flag", "Eiffel Tower"). Do NOT provide a URL.

Respond with a JSON object with a "questions" array. No markdown, no extra text.
{
  "questions": [
    {
      "type": "multichoice|input|true_or_false",
      "question": "string",
      "answer_options": ["string","string","string","string"],
      "answer": "string",
      "hint": "string",
      "difficulty": "easy|medium|hard",
      "points": 1,
      "image_search": "string"
    }
  ]
}`;

    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.deepseek.apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`DeepSeek API error: ${response.status} ${err}`);
    }

    const data = await response.json() as any;
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error('Empty response from DeepSeek');

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error('Failed to parse DeepSeek response as JSON');
    }

    const raw: any[] = Array.isArray(parsed)
      ? parsed
      : parsed.questions ?? Object.values(parsed)[0];

    if (!Array.isArray(raw)) throw new Error('Unexpected response shape from DeepSeek');

    // Resolve images in parallel via Wikimedia — no LLM-hallucinated URLs
    const questions = await Promise.all(raw.map(async (q): Promise<GeneratedQuestion> => {
      const image_url = await fetchWikimediaImage(q.image_search ?? q.question);
      return {
        type: q.type,
        question: q.question,
        ...(q.answer_options ? { answer_options: q.answer_options } : {}),
        answer: q.answer,
        hint: q.hint,
        difficulty: q.difficulty,
        points: DIFFICULTY_POINTS[q.difficulty as QuestionDifficulty] ?? q.points ?? 1,
        image_url,
      };
    }));

    return questions;
  }
}
