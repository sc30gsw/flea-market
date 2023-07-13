import { Test } from '@nestjs/testing'
import { ItemsService } from './items.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Item } from '@/entities/item.entity'
import { UserStatus } from '@/auth/user-status.enum'
import { ItemStatus } from './item-status.enum'
import { NotFoundException } from '@nestjs/common'

const mockItemRepository = () => ({
  // jest.fn()はモック関数(findという名前の関数を定義)
  find: jest.fn(),
  findOne: jest.fn(),
})

// モックユーザーの作成
const mockUser1 = {
  id: '1',
  username: 'test1',
  password: 'password',
  status: UserStatus.PREMIUM,
}

const mockUser2 = {
  id: '2',
  username: 'test2',
  password: 'password',
  status: UserStatus.FREE,
}

describe('itemsServiceTest', () => {
  let itemsService
  let itemRepository
  // サービスとリポジトリーをインスタンス化する処理
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        { provide: getRepositoryToken(Item), useValue: mockItemRepository() },
      ],
    }).compile()

    itemsService = module.get<ItemsService>(ItemsService)
    itemRepository = module.get<Repository<Item>>(getRepositoryToken(Item))
  })

  describe('findAll', () => {
    it('正常系', async () => {
      const expected = []
      // モック関数の戻り値を定義(mockResolvedValueの引数に戻り値を渡す)
      itemRepository.find.mockResolvedValue(expected)

      const result = await itemsService.findAll()

      expect(result).toEqual(expected)
    })
  })

  describe('findById', () => {
    it('正常系', async () => {
      // findOneの戻り値となる商品を定義
      const expected = {
        id: 'test-id',
        name: 'PC',
        price: 50000,
        description: '',
        status: ItemStatus.ON_SALE,
        createdAt: '',
        updatedId: '',
        userId: mockUser1.id,
        user: mockUser1,
      }

      itemRepository.findOne.mockResolvedValue(expected)
      const result = await itemsService.findById('test-id')

      expect(result).toEqual(expected)
    })

    it('異常系: 商品が存在しない', async () => {
      itemRepository.findOne.mockResolvedValue(null)
      await expect(itemsService.findById('test-id')).rejects.toThrow(
        NotFoundException,
      )
    })
  })
})
