import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly accountsService: AccountsService, // ✅ agora sim
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.accountsService.findUserByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto, res: Response) {
    const { email, password } = loginDto;

    try {
      const user = await this.accountsService.findUserByEmail(email);

      if (!user) {
        throw new HttpException(
          { message: 'Usuário não encontrado' },
          HttpStatus.NOT_FOUND,
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException(
          { message: 'Senha inválida' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      const { password: _, ...safeUser } = user;

      const payload = {
        sub: user.id,
        email: user.email,
        accountId: user.account.id,
      };

      const token = this.jwtService.sign(payload);

      // Se receber o response object, configura o cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // false para desenvolvimento
        sameSite: 'lax',
      });

      return {
        data: { user: safeUser },
        status: HttpStatus.OK,
      };
    } catch (error) {
      console.error(error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        { message: 'Erro interno no login' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getProfile(userId: number) {
    return this.accountsService.findUserById(userId);
  }
}
