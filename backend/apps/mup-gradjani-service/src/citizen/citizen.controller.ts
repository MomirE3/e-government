import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CitizenService } from './citizen.service';
import { CreateCitizenDto } from './dto/create-citizen.dto';
import { UpdateCitizenDto } from './dto/update-citizen.dto';

@Controller('citizens')
export class CitizenController {
  constructor(private readonly citizenService: CitizenService) {}

  @MessagePattern('createCitizen')
  async create(@Payload() dto: CreateCitizenDto) {
    return this.citizenService.create(dto);
  }

  @MessagePattern('findAllCitizens')
  findAll() {
    return this.citizenService.findAll();
  }

  @MessagePattern('findCitizenByJmbg')
  async findByJmbg(@Payload() jmbg: string) {
    return this.citizenService.findByJmbg(jmbg);
  }

  @MessagePattern('findOneCitizen')
  async findOne(@Payload() id: string) {
    return this.citizenService.findOne(id);
  }

  @MessagePattern('updateCitizen')
  async update(
    @Payload() data: { id: string; updateCitizenDto: UpdateCitizenDto },
  ) {
    return this.citizenService.update(data.id, data.updateCitizenDto);
  }

  @MessagePattern('removeCitizen')
  async remove(@Payload() id: string) {
    return this.citizenService.remove(id);
  }

  @MessagePattern('findCitizenByEmail')
  async findByEmail(@Payload() data: { email: string }) {
    return this.citizenService.findByEmail(data.email);
  }

  @MessagePattern('createCitizenWithAuth')
  async createWithAuth(@Payload() citizenData: any) {
    return this.citizenService.createWithAuth(citizenData);
  }
}
