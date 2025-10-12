import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(private repo: QuestionRepository) {}

  create(surveyId: number, dto: CreateQuestionDto): Promise<Question> {
    return this.repo.create(surveyId, dto);
  }

  findAllBySurveyId(surveyId: number): Promise<Question[]> {
    return this.repo.findAllBySurveyId(surveyId);
  }

  update(id: number, dto: CreateQuestionDto): Promise<Question> {
    return this.repo.update(id, dto);
  }

  delete(id: number): Promise<void> {
    return this.repo.delete(id);
  }
}
