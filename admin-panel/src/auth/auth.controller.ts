import { Controller, Get, Post, Body, Res, Render, Req } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/')
  getRoot(@Res() res: Response) {
    return res.redirect('/admin/dashboard');
  }

  @Get('login')
  @Render('login')
  getLogin(@Req() req: Request, @Res() res: Response) {
    if (req.cookies?.admin_token) {
      return res.redirect('/admin/dashboard');
    }
    return { layout: false, error: null };
  }

  @Post('auth/login')
  async handleLogin(@Body() body: any, @Res() res: Response) {
    const { username, password } = body;
    try {
      const authData = await this.authService.login(username, password);

      res.cookie('admin_token', authData.token, { httpOnly: true, maxAge: 86400000 });
      res.cookie('admin_username', authData.username, { httpOnly: true, maxAge: 86400000 });
      res.cookie('admin_role', authData.role, { httpOnly: true, maxAge: 86400000 });

      return res.redirect('/admin/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Invalid credentials or connection error.';
      return res.render('login', { layout: false, error: errorMessage, username });
    }
  }

  @Get('auth/logout')
  logout(@Res() res: Response) {
    res.clearCookie('admin_token');
    res.clearCookie('admin_username');
    res.clearCookie('admin_role');
    return res.redirect('/login');
  }
}
