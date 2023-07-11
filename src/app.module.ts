import { Module } from '@nestjs/common'
import { ItemsModule } from './items/items.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [
    ItemsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'flea-market',
      autoLoadEntities: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
