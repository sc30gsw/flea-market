import { ItemStatus } from './item-status.enum'

export type Item = {
  id: string
  name: string
  price: number
  description: string
  status: ItemStatus
}
