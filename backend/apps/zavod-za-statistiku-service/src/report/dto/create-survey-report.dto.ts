import { IsInt, IsObject, IsOptional } from 'class-validator';

export class CreateSurveyReportDto {
  @IsInt()
  surveyId: number;

  @IsOptional()
  @IsObject()
  config?: Record<string, any>;
}
