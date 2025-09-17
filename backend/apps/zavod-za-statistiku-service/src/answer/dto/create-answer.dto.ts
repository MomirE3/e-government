import { IsString, IsInt } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  value: string;

  @IsInt()
  questionId: number;

  @IsString()
  participantToken: string;
}
