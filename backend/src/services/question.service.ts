import { AppDataSource } from '../config/database';
import { Question, QuestionType } from '../entities/Question';

export interface CreateQuestionDto {
  type: QuestionType;
  question: string;
  answer: string;
  answerOptions?: Record<string, string>;
  imageUrl?: string;
  hint?: string;
  categoryId?: string;
}

export class QuestionService {
  private questionRepo = AppDataSource.getRepository(Question);

  async create(data: CreateQuestionDto) {
    this.validateQuestion(data);
    const question = this.questionRepo.create(data);
    return await this.questionRepo.save(question);
  }

  async bulkCreate(data: CreateQuestionDto[]) {
    data.forEach(q => this.validateQuestion(q));
    const questions = this.questionRepo.create(data);
    return await this.questionRepo.save(questions);
  }

  async findAll(limit = 50, offset = 0) {
    return await this.questionRepo.find({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string) {
    const question = await this.questionRepo.findOne({ where: { id } });
    if (!question) throw new Error('Question not found');
    return question;
  }

  async update(id: string, data: Partial<CreateQuestionDto>) {
    const question = await this.findById(id);
    Object.assign(question, data);
    this.validateQuestion(question as CreateQuestionDto);
    return await this.questionRepo.save(question);
  }

  async delete(id: string) {
    const result = await this.questionRepo.delete(id);
    if (result.affected === 0) throw new Error('Question not found');
  }

  private validateQuestion(data: CreateQuestionDto) {
    if (data.type === QuestionType.MULTICHOICE && !data.answerOptions) {
      throw new Error('answerOptions is required for multichoice questions');
    }
  }

  parseCsv(csvContent: string): CreateQuestionDto[] {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must have headers and at least one row');

    const headers = lines[0].split(',').map(h => h.trim());
    const questions: CreateQuestionDto[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = this.parseCsvLine(lines[i]);
      const question: any = {};

      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (!value) return;

        if (header === 'type') question.type = value;
        else if (header === 'question') question.question = value;
        else if (header === 'answer') question.answer = value;
        else if (header === 'answerOptions') {
          try {
            question.answerOptions = JSON.parse(value);
          } catch {
            throw new Error(`Invalid JSON in answerOptions at row ${i + 1}`);
          }
        }
        else if (header === 'imageUrl') question.imageUrl = value;
        else if (header === 'hint') question.hint = value;
      });

      if (question.type && question.question && question.answer) {
        questions.push(question);
      }
    }

    return questions;
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current);
    return result;
  }
}
