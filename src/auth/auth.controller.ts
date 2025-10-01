import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
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
      const auth = await this.authService.login(loginDto, res);
      return res.json({ user: auth.data.user }).status(auth.status).end();
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  @Get('me')
  async me(@Req() req: Request, @Res() res: Response) {
    const authToken = req.cookies.token;

    if (!authToken) {
      return res.status(401).json({ message: 'Não autenticado' });
    }

    try {
      const decoded = this.authService['jwtService'].verify(authToken);

      const user = await this.authService.getProfile(decoded.sub);
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
