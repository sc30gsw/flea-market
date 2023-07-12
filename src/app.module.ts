import { Module } from '@nestjs/common'
import { ItemsModule } from './items/items.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppDataSource } from './data-source'

@Module({
  imports: [ItemsModule, TypeOrmModule.forRoot(AppDataSource.options)],
  controllers: [],
  providers: [],
})
export class AppModule {}
