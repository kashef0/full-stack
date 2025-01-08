import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { EditUserDto } from './dto/edit.user.dto';
import { UserService } from './user.service';
import { RolesGuard } from 'src/auth/rolesGuard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Patch('update')
  @UseGuards(RolesGuard)
  editUser(
    @GetUser() userId,
    @Body() dto: EditUserDto,
  ) {
    return this.userService.editUser(userId, dto);
  }

  @Delete('delete/:id')
  @UseGuards(RolesGuard)
  deleteUser(@Param('id') userId: number) {
    return this.userService.deleteUser(userId);
  }


  @Get('all')
  @UseGuards(JwtGuard, RolesGuard) 
  getAllUsers() {
        return this.userService.getAllUsers();
    }
}
