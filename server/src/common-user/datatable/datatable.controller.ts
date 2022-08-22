import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { User } from '@prisma/client'
import { GetUser } from 'src/auth/decorator'
import { DataTableService } from './datatable.service'
import { AddDataTableDto, ShareDto, UpdateDataTableDto } from './dto'
import { ApiTags } from '@nestjs/swagger'
import { JwtGuard, RoleGuard } from 'src/auth/guard'

@ApiTags('COMMON USER - datatable')
@UseGuards(JwtGuard, new RoleGuard('USER'))
@Controller()
export class DataTableController {
  constructor(private service: DataTableService) {}

  @Post('')
  addDataTable(@Body() dto: AddDataTableDto, @GetUser() user: User) {
    return this.service.addDataTable(dto, user)
  }

  @Put('share')
  shareDataTable(@Body() dto: ShareDto) {
    return this.service.shareDataTable(dto)
  }
  @Put('unshare')
  unshareDataTable(@Body() dto: ShareDto) {
    return this.service.unshareDataTable(dto)
  }
  @Put(':id')
  updateDataTable(@Param('id') id: string, @Body() dto: UpdateDataTableDto) {
    return this.service.updateDataTable(id, dto)
  }

  @Get(':id')
  getDataTableById(
    @Param('id') id: string,
    @Query('amountInPage', ParseIntPipe) amount: number,
    @Query('page', ParseIntPipe) page: number,
    @GetUser() user: User,
  ) {
    return this.service.getDataTableById(id, user, amount, page)
  }

  @Get('by-title/:title/list')
  getDataTablesByTitle(@Param('title') title: string, @GetUser() user: User) {
    return this.service.getDataTablesByTitleList(title, user)
  }

  @Get('all')
  getAllDataTables(@GetUser() user: User) {
    return this.service.getAllDataTables(user)
  }
  @Get('all/list')
  getAllDataTablesList(@GetUser() user: User) {
    return this.service.getAllDataTablesList(user)
  }

  @Put('set-public/:id')
  setDataTablePublic(@Param('id') id: string) {
    return this.service.setDataTablePublic(id)
  }
  @Put('set-private/:id')
  setDataTablePrivate(@Param('id') id: string) {
    return this.service.setDataTablePrivate(id)
  }
}
