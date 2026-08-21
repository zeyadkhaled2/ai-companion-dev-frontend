import { Question } from './questionTypes';
export type SubmitAnswerInput = {
    questionId: string;
    userAnswer: string;
};

export type Attempt = {
    id: string;
    questionId: string;
    userAnswer: string;
    aiScore: number;
    aiFeedback: string;
    createdAt: string;
};

export type AttemptWithQuestion = Attempt & {
  question: Question;
};