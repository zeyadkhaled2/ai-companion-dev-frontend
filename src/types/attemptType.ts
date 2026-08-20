export type SubmitAnswerInput = {
    questionId: string;
    userAnswer: string;
};

export type Attempt = {
    id: string;
    questiondId: string;
    userAnswer: string;
    aiScore: number;
    aiFeedback: string;
    createdAt: string;
};
