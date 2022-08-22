import { Module } from '@nestjs/common';
import { DataTableController } from './datatable.controller';
import { DataTableService } from './datatable.service';

@Module({
  controllers: [DataTableController],
  providers: [DataTableService]
})
export class DataTableModule {}
