import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import type { Repository } from 'typeorm';
import { Users } from './entities/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountsRepository: Repository<Account>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}
  async createAccount(createAccountDto: CreateAccountDto) {
    try {
      // 1. Criar a conta (sem dados, apenas com id)
      const account = this.accountsRepository.create();
      await this.accountsRepository.save(account);

      // 2. Criptografa a senha para armazenar no banco
      const hashPassword = bcrypt.hashSync(createAccountDto.password, 8);
      createAccountDto['password'] = hashPassword;

      // 3. Criar o usuário já relacionando com a conta
      const user = this.usersRepository.create({
        ...createAccountDto,
        account, // faz o vínculo com a account recém-criada
      });

      await this.usersRepository.save(user);

      // 4. Retornar os dois (ou só o user, se preferir)
      return { data: { account, user }, status: HttpStatus.CREATED };
    } catch (err) {
      return {
        data: null,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['account'],
    });
  }

  async findUserById(id: number): Promise<Users | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['account'],
    });
  }
}
