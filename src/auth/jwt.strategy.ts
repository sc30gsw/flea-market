import { User } from '@/entities/user.entity'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
// 認証を行う→Strategyの役割
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    // 親クラスのコンストラクタにオブジェクトを渡す
    super({
      // リクエストのどの部分にJWTがあるかを決める（今回はAuthorizationHeader)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // トークンの有効期限切れを有効化
      ignoreExpiration: false,
      // シークレットキー
      secretOrKey: configService.get<string>('SECRET_KEY'),
    })
  }

  // 認証処理
  async validate(payload: { id: string; username: string }): Promise<User> {
    const { id, username } = payload
    const user = await this.usersRepository.findOneBy({ id, username })

    if (user) {
      return user
    }
    throw new UnauthorizedException()
  }
}
