export interface Quiz {
  id: string;
  task_id: string;
  title?: string;
  description?: string;
}

export interface QuizAnswer {
  id: string;
  quiz_id: string;
  user_id: string;
  score?: number;
  status?: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question: string;
  type: string;
  answer?: string;
  option1?: string;
  option2?: string;
  option3?: string;
}

export interface QuizSubmission {
  user_id: string;
  quiz_id: string;
  question_id: string;
  answer: string;
}
