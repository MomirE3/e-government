import { IsDateString, IsArray, IsOptional, IsString } from 'class-validator';

export class CreateDocsReportDto {
  @IsDateString()
  periodFrom: string;

  @IsDateString()
  periodTo: string;

  @IsArray()
  @IsOptional()
  documentTypes?: string[];

  @IsString()
  @IsOptional()
  title?: string;
}
