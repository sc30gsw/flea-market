import { SetMetadata } from '@nestjs/common'

// 引数にデコレーターを実装した際に定義する引数が渡ってくる
// SetMetadataでstatusesをキーバリュー形式で扱う（statuses: ['FREE', 'PREMIUM'])ようにし、メタデータとして登録
// 認可が必要なロールを受け取りガードで扱うためにメタデータに登録する
export const Role = (...statuses: string[]) => SetMetadata('statuses', statuses)
