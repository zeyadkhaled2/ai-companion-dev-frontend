export type CategoryAverage = {
  category: string;
  averageScore: number;
};

export type ScoreTrendPoint = {
  score: number;
  date: string;
};

export type Stats = {
  totalAttempts: number;
  averageScore: number;
  categoryAverages: CategoryAverage[];
  scoreTrend: ScoreTrendPoint[];
};