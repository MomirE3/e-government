export class Report {
  id: number;
  title: string;
  type: string;
  configJSON: string;
  generatedAt: Date;
  surveyId?: number | null;
}
