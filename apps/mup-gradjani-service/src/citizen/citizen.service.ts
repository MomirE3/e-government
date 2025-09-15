import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';
import { CitizenRepository } from './citizen.repository';
import { Citizen } from './entities/citizen.entity';

@Injectable()
export class CitizenService {
  constructor(private readonly citizenRepository: CitizenRepository) {}

  async create(createCitizenDto: CreateCitizenDto): Promise<Citizen> {
    // Провери да ли JMBG већ постоји
    const existingCitizen = await this.citizenRepository.jmbgExists(
      createCitizenDto.jmbg,
    );
    if (existingCitizen) {
      throw new ConflictException('Citizen with this JMBG already exists');
    }

    return this.citizenRepository.create(createCitizenDto);
  }

  async findAll(): Promise<Citizen[]> {
    return this.citizenRepository.findAll();
  }

  async findOne(id: string): Promise<Citizen> {
    const citizen = await this.citizenRepository.findOne(id);
    if (!citizen) {
      throw new NotFoundException(`Citizen with ID ${id} not found`);
    }
    return citizen;
  }

  async findByJmbg(jmbg: string): Promise<Citizen> {
    const citizen = await this.citizenRepository.findByJmbg(jmbg);
    if (!citizen) {
      throw new NotFoundException(`Citizen with JMBG ${jmbg} not found`);
    }
    return citizen;
  }

  async update(
    id: string,
    updateCitizenDto: UpdateCitizenDto,
  ): Promise<Citizen> {
    // Провери да ли грађанин постоји
    const exists = await this.citizenRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Citizen with ID ${id} not found`);
    }

    // Ако се ажурира JMBG, провери да ли већ постоји
    if (updateCitizenDto.jmbg) {
      const existingCitizen = await this.citizenRepository.findByJmbg(
        updateCitizenDto.jmbg,
      );
      if (existingCitizen && existingCitizen.id !== id) {
        throw new ConflictException('Citizen with this JMBG already exists');
      }
    }

    return this.citizenRepository.update(id, updateCitizenDto);
  }

  async remove(id: string): Promise<Citizen> {
    const exists = await this.citizenRepository.exists(id);
    if (!exists) {
      throw new NotFoundException(`Citizen with ID ${id} not found`);
    }

    return this.citizenRepository.remove(id);
  }
}
