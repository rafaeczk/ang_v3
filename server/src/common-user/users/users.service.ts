import { ConsoleLogger, ForbiddenException, Injectable } from '@nestjs/common'
import { User } from '@prisma/client'
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  
  async findUserByEmail(
    email: string,
    user: User,
  ): Promise<{
    id: string
    name: string
    tag: number
    dataTables: {
      id: string
      isPrivate: boolean
      title: string
    }[]
  }> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        name: true,
        tag: true,
        dataTables: {
          where: {
            OR: [
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
          select: {
            id: true,
            isPrivate: true,
            title: true,
          },
        },
      },
    })
  }
  async findUsersByName(
    name: string,
    user: User,
  ): Promise<
    {
      dataTables: {
        id: string
        isPrivate: boolean
        title: string
      }[]
      id: string
      name: string
    }[]
  > {
    return await this.prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      select: {
        id: true,
        name: true,
        dataTables: {
          where: {
            OR: [
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
          select: {
            id: true,
            isPrivate: true,
            title: true,
          },
        },
      },
    })
  }
  async findUserByNametag(
    user: User,
    name: string,
    tag: string,
  ): Promise<
    | ForbiddenException
    | {
        dataTables: {
          id: string
          isPrivate: boolean
          title: string
        }[]
        id: string
        name: string
        tag: number
      }
  > {
    if (parseInt(tag) === NaN)
      return new ForbiddenException(
        'Tag need to be number, nametag example = "{name}${tag}"',
      )
    return await this.prisma.user.findFirst({
      where: {
        name,
        tag: parseInt(tag),
      },
      select: {
        id: true,
        name: true,
        tag: true,
        dataTables: {
          where: {
            OR: [
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
          select: {
            id: true,
            isPrivate: true,
            title: true,
          },
        },
      },
    })
  }

  async getUserById(id: string, user: User) {
    return await this.prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        tag: true,
        name: true,
        dataTables: {
          where: {
            OR: [
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
          select: {
            title: true,
            isPrivate: true,
            sharedTo: {
              where: {
                sharedTo: {
                  isPrivate: false,
                },
              },
            },
          },
        },
      },
    })
  }
}
