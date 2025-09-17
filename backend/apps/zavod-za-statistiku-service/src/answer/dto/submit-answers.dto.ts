import { Type } from 'class-transformer';
import { ValidateNested, IsArray } from 'class-validator';
import { CreateAnswerDto } from './create-answer.dto';

export class SubmitAnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];
}
