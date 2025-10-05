import { Injectable } from '@nestjs/common';
import { AuthLoginDto } from './dto/auth.login.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { userPayload } from 'src/types/user';
import { AuthRegisterDto } from './dto/auth.register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ authLoginDto }: { authLoginDto: AuthLoginDto }) {
    const { email, password } = authLoginDto;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error('Something went wrong, please try again (exist user)');
    }
    const isPasswordSame = await this.isPasswordValid({
      password,
      hashedPassword: existingUser.password,
    });
    if (!isPasswordSame) {
      throw new Error('Something went wrong, please try again');
    }
    return this.authenticateUser({ userId: existingUser.id });
  }

  async register({ authRegisterDto }: { authRegisterDto: AuthRegisterDto }) {
    const { email, name, password } = authRegisterDto;

    // console.log({ hashedPassword, password });

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error('Something went wrong, please try again (exist user)');
    }
    const hashedPassword = await this.hashPassword({ password });

    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    // const isPasswordSame = await this.isPasswordValid({
    //   password,
    //   hashedPassword: existingUser.password,
    // });
    // if (!isPasswordSame) {
    //   throw new Error('Something went wrong, please try again');
    // }
    return this.authenticateUser({ userId: newUser.id });
  }

  private async hashPassword({ password }: { password: string }) {
    const hashPassword = await hash(password, 10);
    return hashPassword;
  }

  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    const isPasswordValid = await compare(password, hashedPassword);
    return isPasswordValid;
  }

  private async authenticateUser({ userId }: userPayload) {
    const payload: userPayload = { userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
