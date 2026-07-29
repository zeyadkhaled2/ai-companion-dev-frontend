import { Question } from "../types/questionTypes";

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
export type AppStackParamList = {
  Home: undefined;
  QuestionSetup: undefined;
  QuestionDisplay: { question: Question };
};