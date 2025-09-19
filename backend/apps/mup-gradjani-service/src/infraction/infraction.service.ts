import { Injectable } from '@nestjs/common';
import { InfractionRepository } from './infraction.repository';
import { CreateInfractionDto } from './dto/create-infraction.dto';
import { UpdateInfractionDto } from './dto/update-infraction.dto';

@Injectable()
export class InfractionService {
  constructor(private readonly infractionRepository: InfractionRepository) {}

  create(createInfractionDto: CreateInfractionDto) {
    return this.infractionRepository.create(createInfractionDto);
  }

  update(id: string, updateInfractionDto: UpdateInfractionDto) {
    return this.infractionRepository.update(id, updateInfractionDto);
  }

  findAll() {
    return this.infractionRepository.findAll();
  }

  findOne(id: string) {
    return this.infractionRepository.findOne(id);
  }

  remove(id: string) {
    return this.infractionRepository.remove(id);
  }

  async getDuiStatistics(year: number) {
    const infractions = await this.infractionRepository.findByYearAndType(
      year,
      'DRUNK_DRIVING',
    );

    const grouped = infractions.reduce(
      (acc, i) => {
        const key = `${i.municipality}-${i.type}`;
        if (!acc[key]) {
          acc[key] = {
            year,
            municipality: i.municipality,
            type: i.type,
            caseCount: 0,
          };
        }
        acc[key].caseCount++;
        return acc;
      },
      {} as Record<string, any>,
    );

    return Object.values(grouped);
  }
}
