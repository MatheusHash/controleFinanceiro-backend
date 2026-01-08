import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Users } from 'src/accounts/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bill, Category, Account, Users])],
  controllers: [BillsController],
  providers: [BillsService],
})
export class BillsModule {}
