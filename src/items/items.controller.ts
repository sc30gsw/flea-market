import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ItemsService } from './items.service'
import { Item } from './item.model'
import { ItemStatus } from './item-status.enum'

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  findAll(): Item[] {
    return this.itemsService.findAll()
  }

  @Get(':id')
  findById(@Param('id') id: string): Item {
    return this.itemsService.findById(id)
  }

  @Post()
  create(
    @Body('id') id: string,
    @Body('name') name: string,
    @Body('price') price: number,
    @Body('description') description: string,
  ): Item {
    const item = {
      id,
      name,
      price,
      description,
      status: ItemStatus.ON_SALE,
    }

    return this.itemsService.create(item)
  }
}
