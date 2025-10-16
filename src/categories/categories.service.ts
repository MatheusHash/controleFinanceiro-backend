import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/accounts/entities/account.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,

    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { accountId, name, description } = createCategoryDto;

    const account = await this.accountsRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    const category = this.categoriesRepository.create({
      name,
      description,
      account,
    });

    return this.categoriesRepository.save(category);
  }

  async findAllByAccount(accountId: number): Promise<Category[]> {
    return await this.categoriesRepository.find({
      where: { account: { id: accountId } },
      relations: ['account'],
    });
  }
}
