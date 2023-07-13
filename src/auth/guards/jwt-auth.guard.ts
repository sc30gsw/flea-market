import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
// Guard→不正なリクエストをブロック（権限がないユーザーのリクエストや不正なリクエストをブロック）
export class JwtAuthGuard extends AuthGuard('jwt') {}
