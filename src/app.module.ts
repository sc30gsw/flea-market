import { Module } from '@nestjs/common'
import { ItemsModule } from './items/items.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppDataSource } from './data-source'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ItemsModule,
    AuthModule,
    TypeOrmModule.forRoot(AppDataSource.options),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
