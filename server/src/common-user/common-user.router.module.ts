import { Module, UseGuards } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { DataTableModule } from './datatable/datatable.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    DataTableModule,
    RouterModule.register([
      {
        path: 'common-user',
        children: [
          {
            path: 'datatable',
            module: DataTableModule,
          }, {
            path: 'users',
            module: UsersModule,
          }
        ]
      }
    ])
  ]
})
export class CommonUserRouterModule {}
