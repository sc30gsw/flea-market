import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { CreateUserDto } from './dto/craete-user.dto'
import { User } from '@/entities/user.entity'
import { CredentialsDto } from './dto/credentials.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.authService.signup(createUserDto)
  }

  @Post('signin')
  async signin(
    @Body() credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    return await this.authService.signin(credentialsDto)
  }
}
