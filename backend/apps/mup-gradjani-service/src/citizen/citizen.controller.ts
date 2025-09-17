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
    try {
      return await this.citizenService.create(dto);
    } catch (e: any) {
      console.error('[createCitizen] error:', {
        name: e?.name,
        code: e?.code,
        message: e?.message,
        meta: e?.meta,
      });
      throw e;
    }
  }

  @MessagePattern('findAllCitizens')
  findAll() {
    return this.citizenService.findAll();
  }

  @MessagePattern('findCitizenByJmbg')
  findByJmbg(@Payload() jmbg: string) {
    return this.citizenService.findByJmbg(jmbg);
  }

  @MessagePattern('findOneCitizen')
  findOne(@Payload() id: string) {
    return this.citizenService.findOne(id);
  }

  @MessagePattern('updateCitizen')
  update(@Payload() data: { id: string; updateCitizenDto: UpdateCitizenDto }) {
    return this.citizenService.update(data.id, data.updateCitizenDto);
  }

  @MessagePattern('removeCitizen')
  remove(@Payload() id: string) {
    return this.citizenService.remove(id);
  }
}
