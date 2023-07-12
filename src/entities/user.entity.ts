import { UserStatus } from '../auth/user-status.enum'
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { Item } from './item.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column()
  status: UserStatus

  @OneToMany(() => Item, (item) => item.user)
  items: Item[]
}
