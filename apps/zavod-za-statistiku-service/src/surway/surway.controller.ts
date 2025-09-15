import { Controller, Post, Body } from '@nestjs/common';
import { SurwayService } from './surway.service';
import type { CreateSurwayDto } from './dto/create-surway.dto';

@Controller('surway')
export class SurwayController {
  constructor(private readonly surwayService: SurwayService) {}

  @Post()
  create(@Body() createSurwayDto: CreateSurwayDto) {
    return this.surwayService.create(createSurwayDto);
  }

  // @Get()
  // findAll() {
  //   return this.surwayService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.surwayService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSurwayDto: UpdateSurwayDto) {
  //   return this.surwayService.update(+id, updateSurwayDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.surwayService.remove(+id);
  // }
}
