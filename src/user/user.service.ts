import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/cretate-user-dto';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  getUsers() {
    return this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);
    return await this.prismaService.user.create({
      data: createUserDto,
    });
  }

  getUserById(id: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
