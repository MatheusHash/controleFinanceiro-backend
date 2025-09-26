import {
  Controller,
  Post,
  Body,
  Res,
  UnauthorizedException,
  Get,
  Req,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      console.log('=== INICIANDO LOGIN ===');
      console.log('Dados recebidos:', loginDto);

      const auth = await this.authService.login(loginDto, res);
      console.log('Login service retornou:', auth);

      // Verifica se o cookie foi setado
      console.log('Cookie configurado no response');

      return {
        user: auth.data.user,
        status: auth.status,
      };
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    console.log('=== ENDPOINT ME CHAMADO ===');
    console.log('Headers:', req.headers);
    console.log('Cookies brutos:', req.cookies);
    console.log('Cookie header:', req.headers.cookie);

    // Verifica todos os cookies
    if (req.cookies) {
      Object.keys(req.cookies).forEach((key) => {
        console.log(`Cookie [${key}]:`, req.cookies[key]);
      });
    }

    const token = req.cookies?.token;
    console.log('Token encontrado:', token);

    if (!token) {
      console.log('❌ NENHUM TOKEN ENCONTRADO NOS COOKIES');
      return res.status(401).json({ message: 'Não autenticado' });
    }

    try {
      const tokenValue = typeof token === 'object' ? token.token : token;
      console.log('Token value:', tokenValue);

      const decoded = this.authService['jwtService'].verify(tokenValue);
      console.log('Token decodificado:', decoded);

      const user = await this.authService.getProfile(decoded.sub);
      console.log('Usuário encontrado:', user);

      return res.json(user);
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      return res.status(401).json({ message: 'Token inválido' });
    }
  }
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
    return { message: 'Logout realizado com sucesso' };
  }
}
