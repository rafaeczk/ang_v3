import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AuthService } from './auth.service'
import { LogInDto, RegisterDto } from './dtos'

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  @Post('log-in')
  logIn(@Body() logInDto: LogInDto) {
    return this.service.logIn(logInDto)
  }
  
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.service.register(registerDto)
  }

}
