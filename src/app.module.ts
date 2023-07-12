import { Module } from '@nestjs/common'
import { ItemsModule } from './items/items.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppDataSource } from './data-source'
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ItemsModule, TypeOrmModule.forRoot(AppDataSource.options), AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
