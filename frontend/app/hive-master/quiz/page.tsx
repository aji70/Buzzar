'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const questions = [
  {
    id: 1,
    category: '🌍 Geography',
    question: 'Which planet is known as the Red Planet?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correct: 1,
  },
  {
    id: 2,
    category: '🔬 Science',
    question: 'What is the chemical symbol for Gold?',
    options: ['Go', 'Gd', 'Au', 'Ag'],
    correct: 2,
  },
  {
    id: 3,
    category: '📚 History',
    question: 'In which year did World War II end?',
    options: ['1943', '1944', '1945', '1946'],
    correct: 2,
  },
  {
    id: 4,
    category: '🎨 Art',
    question: 'Who painted the Mona Lisa?',
    options: ['Van Gogh', 'Picasso', 'Da Vinci', 'Rembrandt'],
    correct: 2,
  },
  {
    id: 5,
    category: '🌍 Geography',
    question: 'What is the capital of Australia?',
    options: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'],
    correct: 2,
  },
  {
    id: 6,
    category: '🔬 Science',
    question: 'How many bones are in the adult human body?',
    options: ['196', '206', '216', '226'],
    correct: 1,
  },
  {
    id: 7,
    category: '⚽ Sports',
    question: 'How many players are on a standard football team?',
    options: ['9', '10', '11', '12'],
    correct: 2,
  },
  {
    id: 8,
    category: '🎬 Entertainment',
    question: "Which movie features the character 'Simba'?",
    options: ['Bambi', 'The Lion King', 'Jungle Book', 'Tarzan'],
    correct: 1,
  },
  {
    id: 9,
    category: '🔬 Science',
    question: 'What planet is closest to the Sun?',
    options: ['Venus', 'Earth', 'Mercury', 'Mars'],
    correct: 2,
  },
  {
    id: 10,
    category: '📚 History',
    question: 'Who was the first person to walk on the Moon?',
    options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'],
    correct: 1,
  },
];

export default function HiveMasterQuiz() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [streak, setStreak] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | 'streak' | null>(null);
  const [gamePhase, setGamePhase] = useState<'question' | 'feedback' | 'complete'>('question');
  const [streakCount, setStreakCount] = useState(0);

  const question = questions[currentQuestion];

  // Timer countdown
  useEffect(() => {
    if (gamePhase !== 'question' || showFeedback) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAnswer(-1); // Auto-submit as wrong
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePhase, showFeedback]);

  // Handle answer selection
  const handleAnswer = (answerIndex: number) => {
    if (showFeedback) return;

    setSelectedAnswer(answerIndex);
    const isCorrect = answerIndex === question.correct;

    // Update score and streak
    if (isCorrect) {
      setScore((prev) => prev + 50);
      setStreak((prev) => prev + 1);
    } else {
      setScore((prev) => Math.max(prev - 20, 0));
      setStreak(0);
    }

    // Determine feedback type
    let newStreakCount = streakCount;
    if (isCorrect) {
      newStreakCount = streakCount + 1;
      setStreakCount(newStreakCount);
      if (newStreakCount % 3 === 0) {
        setFeedbackType('streak');
      } else {
        setFeedbackType('correct');
      }
    } else {
      setStreakCount(0);
      setFeedbackType('wrong');
    }

    setShowFeedback(true);
    setGamePhase('feedback');

    // Move to next question or complete
    setTimeout(() => {
      if (currentQuestion === questions.length - 1) {
        setGamePhase('complete');
      } else {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setGamePhase('question');
        setTimeLeft(30);
      }
    }, 1500);
  };

  // Next question button
  const handleNextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      setGamePhase('complete');
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setGamePhase('question');
      setTimeLeft(30);
    }
  };

  // Handle back
  const handleBack = () => {
    router.push('/');
  };

  // Handle play again
  const handlePlayAgain = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTimeLeft(30);
    setStreak(0);
    setStreakCount(0);
    setShowFeedback(false);
    setFeedbackType(null);
    setGamePhase('question');
  };

  // Complete screen
  if (gamePhase === 'complete') {
    const newRank = score >= 300 ? 'Scout Bee' : 'Worker Bee';
    const oldRank = 'Worker Bee';
    const rankUp = newRank !== oldRank;

    return (
      <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#2a1810] via-[#1a1008] to-[#0f0905]">
        <div className="mx-auto w-full max-w-[560px] flex flex-col min-h-screen bg-gradient-to-b from-[#2a1810] via-[#1a1008] to-[#0f0905] relative overflow-y-auto pb-20 items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-amber-400 mb-6" style={{ fontFamily: "'Fredoka One'" }}>
              HIVE COMPLETE!
            </h1>

            <img
              src="/assets/trophy_hex_gold_full.png"
              alt="Trophy"
              className="mx-auto mb-6"
              style={{ height: '120px', width: 'auto', objectFit: 'contain' }}
            />

            <div className="mb-8">
              <p className="text-5xl font-bold text-amber-400">{score}</p>
              <p className="text-amber-200 text-sm mt-1">XP EARNED</p>
            </div>

            {rankUp && (
              <div className="mb-6 wooden-carved rounded-lg p-4 border-2 border-amber-600 bg-green-900/20">
                <p className="text-green-400 font-bold">🎉 RANK UP!</p>
                <p className="text-amber-100 text-sm mt-1">
                  {oldRank} → {newRank}
                </p>
              </div>
            )}

            <div className="mb-8 wooden-carved rounded-lg p-3 border-2 border-amber-600">
              <p className="text-amber-100 text-xs uppercase letter-spacing-wide">Streak Bonuses</p>
              <p className="text-2xl font-bold text-amber-400">×{streakCount}</p>
            </div>

            <div className="flex flex-col gap-3 mt-12">
              <button
                onClick={handlePlayAgain}
                className="w-full bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-3 px-6 rounded-full transition-all transform active:translate-y-1"
                style={{
                  boxShadow: '0 4px 0 #92400E',
                  letterSpacing: '0.05em',
                }}
              >
                PLAY AGAIN
              </button>
              <button
                onClick={handleBack}
                className="w-full border-2 border-amber-500 text-amber-400 font-bold py-3 px-6 rounded-full hover:bg-amber-900/20 transition-all"
                style={{ letterSpacing: '0.05em' }}
              >
                HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const answerLetters = ['A', 'B', 'C', 'D'];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = isAnswered && selectedAnswer === question.correct;

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-[#2a1810] via-[#1a1008] to-[#0f0905]">
      <div className="mx-auto w-full max-w-[560px] flex flex-col min-h-screen bg-gradient-to-b from-[#2a1810] via-[#1a1008] to-[#0f0905] relative">
        {/* HEADER BAR */}
        <header
          className="flex items-center justify-between px-4 py-4 sticky top-0 z-40"
          style={{
            background: 'linear-gradient(180deg, #3D1F05 0%, #2A1503 100%)',
            borderBottom: '2px solid rgba(245,158,11,0.3)',
          }}
        >
          <button onClick={handleBack} className="text-2xl hover:scale-110 transition-transform">
            ←
          </button>
          <h1 className="text-xl font-bold text-amber-400" style={{ fontFamily: "'Fredoka One'" }}>
            HIVE MASTER
          </h1>
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.3)',
              color: '#F59E0B',
            }}
          >
            <span>🐝</span>
            <span>Worker Bee</span>
          </div>
        </header>

        {/* PROGRESS + STATS BAR */}
        <section className="px-4 py-4 bg-black/20">
          {/* Stats Row */}
          <div className="flex justify-between items-center gap-3 mb-4">
            {/* Timer */}
            <div className="flex flex-col items-center">
              <p
                className="text-3xl font-bold transition-colors"
                style={{
                  color: timeLeft < 10 ? '#EF4444' : '#F59E0B',
                  animation: timeLeft < 10 ? 'pulse-amber 1s infinite' : 'none',
                }}
              >
                {timeLeft}
              </p>
              <p className="text-xs text-amber-200">sec</p>
            </div>

            {/* Score */}
            <div className="flex flex-col items-center">
              <p className="text-3xl font-bold text-amber-400">{score}</p>
              <p className="text-xs text-amber-200">XP</p>
            </div>

            {/* Question Counter */}
            <div className="flex flex-col items-center">
              <p className="text-xl font-bold text-amber-200">
                Q {currentQuestion + 1}/{questions.length}
              </p>
            </div>
          </div>

          {/* Honeycomb Progress Bar */}
          <div className="flex justify-center gap-2">
            {questions.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: '28px',
                  height: '28px',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  background: idx < currentQuestion ? '#F59E0B' : '#2C1505',
                  border: idx === currentQuestion ? '2px solid #F59E0B' : '1px solid rgba(245,158,11,0.3)',
                  animation: idx === currentQuestion ? 'pulse-amber 2s infinite' : 'none',
                }}
              />
            ))}
          </div>
        </section>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col px-4 py-4 relative">
          {/* QUESTION CARD */}
          <div
            className="wooden-carved rounded-2xl p-5 relative mb-6"
            style={{
              background: 'linear-gradient(145deg, #2C1A08, #1A0F05)',
              border: '1px solid rgba(245,158,11,0.25)',
              borderRadius: '16px',
              overflow: 'visible',
            }}
          >
            {/* Category Tag */}
            <div
              className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-4"
              style={{
                background: 'rgba(245,158,11,0.15)',
                color: '#F59E0B',
              }}
            >
              {question.category}
            </div>

            {/* Question Text */}
            <h2 className="text-lg font-semibold text-white mb-6 leading-relaxed text-center">
              {question.question}
            </h2>

            {/* Floating Bee */}
            <img
              src="/assets/bee_happy_bucket.png"
              alt=""
              style={{
                position: 'absolute',
                bottom: '-18px',
                right: '-6px',
                height: '58px',
                width: 'auto',
                objectFit: 'contain',
                opacity: 0.9,
                pointerEvents: 'none',
                filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.35))',
              }}
            />
          </div>

          {/* ANSWER OPTIONS */}
          <div className="grid grid-cols-2 gap-3 relative flex-1">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => !isAnswered && handleAnswer(idx)}
                disabled={isAnswered}
                className="relative p-4 rounded-2xl flex flex-col items-center justify-center min-h-[90px] transition-all transform active:scale-95"
                style={{
                  background: 'linear-gradient(145deg, #2C1A08, #1A0F05)',
                  border:
                    isAnswered && idx === question.correct
                      ? '2px solid #10B981'
                      : isAnswered && idx === selectedAnswer && !isCorrect
                      ? '2px solid #EF4444'
                      : '2px solid rgba(245,158,11,0.3)',
                  backgroundColor:
                    isAnswered && idx === question.correct
                      ? 'rgba(16,185,129,0.15)'
                      : isAnswered && idx === selectedAnswer && !isCorrect
                      ? 'rgba(239,68,68,0.15)'
                      : selectedAnswer === idx && !showFeedback
                      ? 'rgba(245,158,11,0.1)'
                      : 'transparent',
                  boxShadow:
                    isAnswered && idx === question.correct
                      ? '0 0 20px rgba(16,185,129,0.3)'
                      : isAnswered && idx === selectedAnswer && !isCorrect
                      ? '0 0 20px rgba(239,68,68,0.3)'
                      : 'none',
                  cursor: isAnswered ? 'default' : 'pointer',
                }}
              >
                {/* Letter Badge */}
                <div
                  className="absolute top-2 left-2 w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                  style={{
                    background: 'rgba(245,158,11,0.2)',
                    color: '#F59E0B',
                  }}
                >
                  {answerLetters[idx]}
                </div>

                {/* Answer Text */}
                <p className="text-white text-sm text-center px-2">{option}</p>

                {/* Correct Icon */}
                {isAnswered && idx === question.correct && (
                  <span className="text-2xl mt-2">✓</span>
                )}

                {/* Wrong Icon */}
                {isAnswered && idx === selectedAnswer && !isCorrect && (
                  <span className="text-2xl mt-2 text-red-400">✗</span>
                )}
              </button>
            ))}

            {/* FEEDBACK OVERLAY */}
            {showFeedback && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl backdrop-blur-sm"
                style={{
                  background:
                    feedbackType === 'correct'
                      ? 'rgba(16,185,129,0.12)'
                      : feedbackType === 'streak'
                      ? 'rgba(245,158,11,0.12)'
                      : 'rgba(239,68,68,0.12)',
                }}
              >
                {/* Bee Image */}
                <img
                  src={
                    feedbackType === 'correct'
                      ? '/assets/bee_happy_bucket.png'
                      : feedbackType === 'streak'
                      ? '/assets/bee_cool_sunglasses.png'
                      : '/assets/bee_sad.png'
                  }
                  alt=""
                  className="mb-3"
                  style={{
                    height: '80px',
                    width: 'auto',
                    maxWidth: '140px',
                    objectFit: 'contain',
                    animation: feedbackType === 'correct' ? 'float 1.5s ease-in-out infinite' : 'none',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
                  }}
                />

                {/* Feedback Text */}
                <p
                  className="text-2xl font-bold mb-2"
                  style={{
                    color:
                      feedbackType === 'correct'
                        ? '#10B981'
                        : feedbackType === 'streak'
                        ? '#F59E0B'
                        : '#EF4444',
                  }}
                >
                  {feedbackType === 'correct'
                    ? '✓ CORRECT!'
                    : feedbackType === 'streak'
                    ? '🔥 HONEY RUSH!'
                    : '✗ WRONG!'}
                </p>

                {/* Points Text */}
                <p
                  className="text-lg font-bold"
                  style={{
                    color:
                      feedbackType === 'correct'
                        ? '#10B981'
                        : feedbackType === 'streak'
                        ? '#F59E0B'
                        : '#EF4444',
                  }}
                >
                  {feedbackType === 'correct'
                    ? '+50 XP'
                    : feedbackType === 'streak'
                    ? '+150 XP'
                    : '-20 XP'}
                </p>
              </div>
            )}
          </div>

          {/* NEXT BUTTON */}
          {isAnswered && !showFeedback && (
            <button
              onClick={handleNextQuestion}
              className="w-full mt-6 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold py-4 px-6 rounded-full transition-all transform active:translate-y-1"
              style={{
                boxShadow: '0 4px 0 #92400E',
                letterSpacing: '0.05em',
                fontSize: '1rem',
              }}
            >
              NEXT QUESTION →
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
