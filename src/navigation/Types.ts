import { Question } from "../types/questionTypes";
import { Attempt } from "../types/attemptType";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  QuestionSetup: undefined;
  QuestionDisplay: { question: Question };
  FeedbackScreen: { attempt: Attempt };
};