import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator'
import { UserStatus } from '../user-status.enum'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  username: string

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @MaxLength(32)
  password: string

  @IsEnum(UserStatus)
  status: UserStatus
}
