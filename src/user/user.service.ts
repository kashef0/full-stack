import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new ForbiddenException('ogitligt användare id, det måste vara ett positivt nummer');
      }
  
      const existUser = await this.prisma.user.findUnique({
        where: {id: userId},
      });
  
      if (!existUser) {
        throw new ForbiddenException(`ingen användare med angivna id: ${userId}`);
      }
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
        console.error('Fel vid uppdatering av användare:', error);
        throw new InternalServerErrorException('Det gick inte att uppdatera användare');
    }

  }

  async deleteUser(userId: number) {

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new ForbiddenException('ogitligt användare id, det måste vara ett positivt nummer');
    }

    const existUser = await this.prisma.user.findUnique({
      where: {id: userId},
    });

    if (!existUser) {
      throw new ForbiddenException(`ingen användare med angivna id: ${userId}`);
    }

    const deleteUser = await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
    return deleteUser;
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
