import { Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'
import { AddDataTableDto, ShareDto, UpdateDataTableDto } from './dto'

@Injectable()
export class DataTableService {
  constructor(private prisma: PrismaService) {}

  async addDataTable(dto: AddDataTableDto, user: User) {
    return await this.prisma.dataTable.create({
      data: {
        title: dto.title,
        header: dto.header,
        body: JSON.parse(JSON.stringify(dto.body)),
        authorId: user.id,
      },
      select: {
        id: true,
      },
    })
  }

  async updateDataTable(id: string, dto: UpdateDataTableDto) {
    return await this.prisma.dataTable.update({
      where: {
        id: id,
      },
      data: {
        title: dto.title,
        header: dto.header,
        body: JSON.parse(JSON.stringify(dto.body)),
      },
    })
  }

  async getDataTableById(
    id: string,
    user: User,
    amount?: number,
    page?: number,
  ) {
    const dataTable = await this.prisma.dataTable.findFirst({
      where: {
        AND: [
          { id },
          {
            OR: [
              { author: user },
              { isPrivate: false },
              {
                sharedTo: {
                  some: {
                    sharedTo: user,
                  },
                },
              },
            ],
          },
        ],
      },
    })
    if (dataTable) {
      if (amount && page) {
        let body = JSON.parse(JSON.stringify(dataTable.body))
        let paginatedBody = body.slice((page - 1) * amount, page * amount)
        let nextPaginatedBody = body.slice(page * amount, (page + 1) * amount)
        return {
          ...dataTable,
          body: paginatedBody,
          hasNextPage: nextPaginatedBody == [],
          hesPreviousPage: page !== 1,
        }
      } else return dataTable
    } else return null
  }

  async getDataTablesByTitleList(title: string, user: User) {
    return await this.prisma.dataTable.findMany({
      where: {
        AND: [
          {
            title: {
              contains: title
            }
          },
          {
            OR: [
              { author: user },
              { isPrivate: false },
              {
                sharedTo: {
                  some: {
                    sharedTo: user
                  }
                }
              }
            ]
          }
        ]
      },
      select: {
        id: true,
        author: {
          select: { name: true, tag: true, id: true },
        },
        title: true,
      },
    })
  }

  async getAllDataTables(user: User) {
    return await this.prisma.dataTable.findMany({
      where: {
        OR: [
          {
            author: user,
          },
          {
            sharedTo: {
              some: {
                sharedTo: user,
              },
            },
          },
        ],
      },
    })
  }

  async getAllDataTablesList(user: User) {
    return await this.prisma.dataTable.findMany({
      where: {
        OR: [
          {
            author: user,
          },
          {
            sharedTo: {
              some: {
                sharedTo: user,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        isPrivate: true,
        updatedAt: true,
      },
    })
  }

  async setDataTablePublic(id: string) {
    return await this.prisma.dataTable.update({
      where: {
        id: id,
      },
      data: {
        isPrivate: false,
      },
      select: {
        id: true,
        title: true,
        isPrivate: true,
      },
    })
  }
  async setDataTablePrivate(id: string) {
    return await this.prisma.dataTable.update({
      where: {
        id: id,
      },
      data: {
        isPrivate: true,
      },
      select: {
        id: true,
        title: true,
        isPrivate: true,
      },
    })
  }

  async shareDataTable(dto: ShareDto) {
    return this.prisma.dataTablesToUsers.create({
      data: {
        dataTableId: dto.dataTableId,
        sharedToId: dto.userId,
      },
    })
  }
  async unshareDataTable(dto: ShareDto) {
    return this.prisma.dataTablesToUsers.delete({
      where: {
        sharedToId_dataTableId: {
          sharedToId: dto.userId,
          dataTableId: dto.dataTableId,
        },
      },
    })
  }
}
