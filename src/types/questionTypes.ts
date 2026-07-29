export type Category = 'React' | 'Node' | 'JavaScript' | 'HR' | 'SQL';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type GenerateQuestionInput = {
  category: Category;
  difficulty: Difficulty;
};

export type Question = {
  id: string;
  category: Category;
  difficulty: Difficulty;
  content: string;
};