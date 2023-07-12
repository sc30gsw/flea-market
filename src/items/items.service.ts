import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'
import { ItemStatus } from './item-status.enum'
import { CreateItemDto } from './dto/create-item.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { Item } from '@/entities/item.entity'

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private itemsRepository: Repository<Item>,
  ) {}

  async findAll(): Promise<Item[]> {
    const items = await this.itemsRepository.find().catch((e) => {
      throw new InternalServerErrorException(e.message)
    })

    return items
  }

  async findById(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOneBy({ id })

    if (!item)
      throw new NotFoundException(`${id}に一致するデータが見つかりませんでした`)

    return item
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

  async updateStatus(id: string): Promise<UpdateResult> {
    const item = await this.itemsRepository.findOneBy({ id })

    if (!item)
      throw new NotFoundException(`${id}に一致するデータが見つかりませんでした`)

    const updatedItem = await this.itemsRepository
      .update(item.id, {
        status: ItemStatus.SOLD_OUT,
        updatedAt: new Date().toISOString(),
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message)
      })

    return updatedItem
  }

  async delete(id: string): Promise<DeleteResult> {
    const item = await this.itemsRepository.findOneBy({ id })

    if (!item)
      throw new NotFoundException(`${id}に一致するデータが見つかりませんでした`)

    const deletedItem = await this.itemsRepository.delete(id).catch((e) => {
      throw new InternalServerErrorException(e.message)
    })

    return deletedItem
  }
}
