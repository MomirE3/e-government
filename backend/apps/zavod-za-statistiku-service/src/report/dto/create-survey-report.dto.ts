import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateSurveyReportDto {
  @IsNumber()
  surveyId: number;

  @IsString()
  @IsOptional()
  title?: string;
}