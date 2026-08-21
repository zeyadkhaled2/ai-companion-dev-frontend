import { Question } from "../types/questionTypes";
import { Attempt } from "../types/attemptTypes";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  QuestionSetup: undefined;
  QuestionDisplay: { question: Question };
  FeedbackScreen: { attempt: Attempt };
  History: undefined;
};