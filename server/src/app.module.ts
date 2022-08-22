import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'
import { CommonUserRouterModule } from './common-user/common-user.router.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,

    AuthModule,
    CommonUserRouterModule,
  ],
})
export class AppModule {}
