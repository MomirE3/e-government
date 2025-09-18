import { IsInt, IsArray, IsOptional } from 'class-validator';

export class CreateDuiReportDto {
  @IsInt()
  year: number;

  @IsArray()
  @IsOptional()
  municipalities?: string[];

  @IsArray()
  @IsOptional()
  ageBands?: string[];

  @IsArray()
  @IsOptional()
  bacBands?: string[];
}
