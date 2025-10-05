import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { requestWithUser } from 'src/types/user';
import { UserService } from 'src/user/user.service';
import { AuthRegisterDto } from './dto/auth.register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  register(@Body() authRegister: AuthRegisterDto) {
    // console.log(authRegister);
    return this.authService.register({ authRegisterDto: authRegister });
  }
  @Post('login')
  login(@Body() authLogin: AuthLoginDto) {
    // console.log(authLogin);
    return this.authService.login({ authLoginDto: authLogin });
  }

  //Identify user
  @UseGuards(JwtAuthGuard)
  @Get()
  async authenticateUser(@Req() req: requestWithUser) {
    console.log(req.user);
    return this.userService.getUserById(req.user.userId);
  }
}
