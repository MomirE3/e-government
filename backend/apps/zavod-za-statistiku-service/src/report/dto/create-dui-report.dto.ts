import { IsInt, IsArray, IsOptional } from 'class-validator';

export class CreateDuiReportDto {
  @IsInt()
  year: number;

  @IsArray()
  @IsOptional()
  municipalities?: string[];
}
