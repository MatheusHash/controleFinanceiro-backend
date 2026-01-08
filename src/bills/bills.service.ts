import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bill } from './entities/bill.entity';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Users } from 'src/accounts/entities/users.entity';

@Injectable()
export class BillsService {
  constructor(
    @InjectRepository(Bill) private readonly billsRepository: Repository<Bill>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async create(createBillDto: CreateBillDto) {
    console.log(`create bill data: `, createBillDto);

    const { userId, name, amount, categoryId, accountId } = createBillDto;

    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
        account_id: accountId,
      },
      relations: { account: true },
      select: { id: true, name: true, account: { id: true } },
    });

    console.log(`user: `, user);

    if (!user) {
      throw new NotFoundException('Conta não encontrada');
    }

    const bill = this.billsRepository.create({
      amount,
      category_id: categoryId,
      name,
    });

    return {
      data: { bill },
      status: 500,
    };
  }
}
