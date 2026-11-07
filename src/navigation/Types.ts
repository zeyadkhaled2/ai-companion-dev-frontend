import { Question } from "../types/questionTypes";
import { Attempt } from "../types/attemptTypes";
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { MainTabsParamList } from './MainTabs';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
export type AppStackParamList = {
  Tabs: NavigatorScreenParams<MainTabsParamList> | undefined;
  QuestionSetup: undefined;
  QuestionDisplay: { question: Question };
  FeedbackScreen: { attempt: Attempt };
};
