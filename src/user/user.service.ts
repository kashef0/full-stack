import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './dto/edit.user.dto';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(
    userId: any,
    dto: EditUserDto,
  ) {
    try {
        
        console.log('DTO Data:', dto);
        const user = await this.prisma.user.update({
          where: {
            id: userId.id,
          },
          data: {
            ...dto
          },
        });
        
        delete user.hash;
        return user;
    } catch (error){
        console.error('Error updating user:', error);
        throw new InternalServerErrorException('Failed to update user');
    }

  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
