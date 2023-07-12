import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { ItemStatus } from './item-status.enum'
import { CreateItemDto } from './dto/create-item.dto'
import { v4 as uuid } from 'uuid'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Item } from '@/entities/item.entity'

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  private items: Item[] = []

  findAll(): Item[] {
    return this.items
  }

  findById(id: string): Item {
    const item = this.items.find((item) => item.id === id)

    if (!item) throw new NotFoundException()

    return this.items.find((item) => item.id === id)
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const { name, price, description } = createItemDto

    const item = await this.itemsRepository
      .save({
        name,
        price,
        description,
        status: ItemStatus.ON_SALE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message)
      })

    return item
  }

  updateStatus(id: string): Item {
    const item = this.items.find((item) => item.id === id)
    item.status = ItemStatus.SOLD_OUT

    return item
  }

  delete(id: string): void {
    this.items = this.items.filter((item) => item.id !== id)
  }
}
