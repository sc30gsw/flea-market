import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { ItemsService } from './items.service'
import { Item } from '@/entities/item.entity'
import { CreateItemDto } from './dto/create-item.dto'
import { DeleteResult, UpdateResult } from 'typeorm'

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  async findAll(): Promise<Item[]> {
    return await this.itemsService.findAll()
  }

  @Get(':id')
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<Item> {
    return await this.itemsService.findById(id)
  }

  @Post()
  async create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return await this.itemsService.create(createItemDto)
  }

  @Patch(':id')
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UpdateResult> {
    return await this.itemsService.updateStatus(id)
  }

  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteResult> {
    return await this.itemsService.delete(id)
  }
}
