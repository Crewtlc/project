export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  answers: string[];
  isFinished: boolean;
  questions: Question[];
}