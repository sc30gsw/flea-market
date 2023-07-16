import { Test } from '@nestjs/testing'
import { ItemsService } from './items.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Item } from '@/entities/item.entity'
import { UserStatus } from '@/auth/user-status.enum'
import { ItemStatus } from './item-status.enum'
import { BadRequestException, NotFoundException } from '@nestjs/common'

const mockItemRepository = () => ({
  // jest.fn()はモック関数(findという名前の関数を定義)
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
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

  describe('create', () => {
    it('正常系', async () => {
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

      itemRepository.save.mockResolvedValue(expected)
      const result = await itemsService.create(
        {
          name: 'PC',
          price: 50000,
          description: '',
        },
        mockUser1,
      )

      expect(result).toEqual(expected)
    })
  })

  describe('updateStatus', () => {
    const mockItem = {
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

    it('正常系', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem)
      itemRepository.update.mockResolvedValue(true)

      await itemsService.updateStatus('test-id', mockUser2)

      // findOne・updateが読み出されると成功・読み出されないと失敗
      expect(itemRepository.findOne).toHaveBeenCalled()
      expect(itemRepository.update).toHaveBeenCalled()
    })

    it('異常系: 自身の商品を購入', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem)
      await expect(
        itemsService.updateStatus('test-id', mockUser1),
      ).rejects.toThrow(BadRequestException)
    })
  })

  describe('delete', () => {
    const mockItem = {
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

    it('正常系', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem)
      itemRepository.delete.mockResolvedValue(true)

      await itemsService.delete('test-id', mockUser1)

      expect(itemRepository.findOne).toHaveBeenCalled()
      expect(itemRepository.delete).toHaveBeenCalled()
    })

    it('異常系: 商品が存在しない', async () => {
      itemRepository.findOne.mockResolvedValue(null)
      await expect(itemsService.delete('test-id', mockUser1)).rejects.toThrow(
        NotFoundException,
      )
    })

    it('異常系: 他人の商品を削除', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem)
      await expect(itemsService.delete('test-id', mockUser2)).rejects.toThrow(
        BadRequestException,
      )
    })
  })
})
