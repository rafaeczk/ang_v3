import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { LogInDto, RegisterDto } from './dtos'
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hash = await argon.hash(registerDto.password)
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        hash: hash,
        name: registerDto.name,
      },
    })
    delete user.hash
    return user
  }
  async logIn(logInDto: LogInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: logInDto.email,
      },
    })
    if (!user) return { message: 'User not found' }
    const passwordValid = await argon.verify(user.hash, logInDto.password)
    if (!passwordValid) return { message: 'Wrong password' }

    return this.signToken(user.id, user.email)
  }

  private signToken(userId: string, email: string) {
    const payload = { sub: userId, email }
    return this.jwt.sign(payload, {
      expiresIn: '24h',
      secret: this.config.get('SECRET'),
    })
  }
}
