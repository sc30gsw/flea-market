import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Item } from './entities/item.entity'
import { User } from './entities/user.entity'

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'password',
  database: 'flea-market',
  synchronize: true,
  logging: false,
  entities: [Item, User],
  migrations: ['src/migrations/*.ts'],
})
