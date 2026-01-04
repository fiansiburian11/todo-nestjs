import { Body, Controller, Delete, Param, Post, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { RequestLoginDto } from './dto/login-request.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('/register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('/login')
  async login(
    @Body() requestLoginDto: RequestLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const accessToken = await this.authService.login(requestLoginDto);
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: this.config.get('app.NODE_ENV') === 'production', // production wajib true (HTTPS)
      sameSite: 'lax', // aman untuk mayoritas kasus
      maxAge: 15 * 60 * 1000, // 15 menit
      path: '/', // cookie berlaku untuk semua route
    });

    return { message: 'Login Sukses' };
  }



  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
