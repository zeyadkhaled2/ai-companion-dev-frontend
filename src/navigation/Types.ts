import { Question } from "../types/questionTypes";
import { Attempt } from "../types/attemptTypes";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
export type AppStackParamList = {
  MainTabs: undefined;
  QuestionSetup: undefined;
  QuestionDisplay: { question: Question };
  FeedbackScreen: { attempt: Attempt };
};