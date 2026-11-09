import { Difficulty, Question } from '../../features/practice/types/questionTypes';
import { Attempt } from '../../features/practice/types/attemptTypes';
import type { NavigatorScreenParams } from '@react-navigation/native';
import type { MainTabsParamList } from './MainTabs';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};
export type AppStackParamList = {
  Tabs: NavigatorScreenParams<MainTabsParamList> | undefined;
  QuestionSetup: undefined;
  DataStructuresLab: undefined;
  QueueLesson: undefined;
  RecursionLesson: undefined;
  TreeTraversal: undefined;
  OutputChallenge: {
    difficulty: Difficulty;
    fromHome?: boolean;
    returnTo?: 'interview' | 'mentor';
  };
  QuestionDisplay: { question: Question };
  FeedbackScreen: { attempt: Attempt };
};
