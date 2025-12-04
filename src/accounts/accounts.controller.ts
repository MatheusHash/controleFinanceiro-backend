import { Controller, Post, Body, Get, Param, Req, Res } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import type { Response, Request } from 'express';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post('create')
  create(@Body() createAccountDto: CreateAccountDto) {
    console.log(createAccountDto);
    return this.accountsService.createAccount(createAccountDto);
  }
  @Get('user/me')
  async me(@Req() req: Request, @Res() res: Response) {
    const authToken = req.cookies.token as string;
    if (!authToken) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    try {
      const decoded = this.accountsService['jwtService'].verify(authToken);
      const user = await this.accountsService.findUserById(decoded.sub);
      return res.json(user);
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(401).json({ message: 'Token inválido' });
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logout realizado com sucesso' };
  }

  @Get('user')
  findUserById(
    @Param('id') id: number,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const authToken = req.cookies.token as string;
    if (!authToken) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    return { user: this.accountsService.findUserById(id) };
  }
}
