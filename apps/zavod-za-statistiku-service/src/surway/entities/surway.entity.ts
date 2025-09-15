export type Survey = {
  id: number;
  title: string;
  description?: string;
  period: string;
  status: string;

  questions: any[];
  sample: any;
  participants: any[];
  reports: any[];
};
