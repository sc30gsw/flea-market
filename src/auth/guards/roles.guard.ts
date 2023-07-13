import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

@Injectable()
// Guardとして実装するにはCanActivateを継承する必要がある(JWTではAuthGuardが継承している)
// trueでリクエスト許可/falseで403エラーなど
export class RolesGuard implements CanActivate {
  // リフレクターでRoleデコレーターのメタデータを取得する
  constructor(private reflector: Reflector) {}

  // ロール認可処理
  canActivate(ctx: ExecutionContext): boolean {
    // ロールを取得（第一引数に取得したいメタデータのキー、第二引数にハンドラーのメタデータを渡す）
    const requiredStatuses = this.reflector.get<string[]>(
      'statuses',
      ctx.getHandler(),
    )

    // デコレーターに指定がない場合、許可
    if (!requiredStatuses) return true

    const { user } = ctx.switchToHttp().getRequest()

    // ユーザーのステータスがメタデータから取得したステータスに一致すれば実行を許可
    // デコーレーターで「@Role(UserStatus.PREMIUM)」のようにするとメタデータにPREMIUMが登録される
    // ユーザーのステータスがメタデータ(@Roleの引数のPREMIUM)に一致すれば認可される
    return requiredStatuses.some((status) => user.status.includes(status))
  }
}
