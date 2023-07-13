import { User } from '@/entities/user.entity'
import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateUserDto } from './dto/craete-user.dto'
import * as bcrypt from 'bcrypt'
import { CredentialsDto } from './dto/credentials.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, status } = createUserDto

    // ハッシュ値の強度を高めるためも文字列を生成
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(password, salt)

    const user = await this.usersRepository
      .save({
        username,
        password: hashPassword,
        status,
      })
      .catch((e) => {
        throw new InternalServerErrorException(e.message)
      })

    return user
  }

  async signin(
    credentialsDto: CredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = credentialsDto
    const user = await this.usersRepository.findOneBy({ username })

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { id: user.id, username: user.username }
      const accessToken = await this.jwtService.sign(payload)

      return { accessToken }
    }

    throw new UnauthorizedException(
      'ユーザー名またはパスワードを確認してください',
    )
  }
}
