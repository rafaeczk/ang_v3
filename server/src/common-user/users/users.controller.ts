import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { User } from '@prisma/client'
import { GetUser } from 'src/auth/decorator'
import { JwtGuard, RoleGuard } from 'src/auth/guard'
import { UsersService } from './users.service'

@ApiTags('COMMON USER - users')
@UseGuards(JwtGuard, new RoleGuard('USER'))
@Controller()
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user
  }

  @Get('find/by-email')
  findUsersByEmail(@Query('email') email: string, @GetUser() user: User){
    return this.service.findUserByEmail(email, user)
  }
  @Get('find/by-name')
  findUsersByName(@Query('name') email: string, @GetUser() user: User){
    return this.service.findUsersByName(email, user)
  }
  
  @Get('find/by-nametag')
  findUsersByNametag(@Query('nametag') nametag: string, @GetUser() user: User){
    return this.service.findUserByNametag(user, nametag.split('$')[0], nametag.split('$')[1])
  }

  @Get(':id')
  getUserById(@Param('id') id: string, @GetUser() user: User) {
    return this.service.getUserById(id, user)
  }
}
