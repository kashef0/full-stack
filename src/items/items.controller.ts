import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/createItem.dto';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/auth/rolesGuard';

@Controller('items')
@UseGuards(JwtGuard)
export class ItemsController {
    constructor(private itemsService: ItemsService) {}

    @Post('create')
    createItem(@Body() dto: CreateItemDto, @GetUser() user: User) {
        return this.itemsService.createItem(dto, user.id);
    }

    @Patch('update/:id')
    @UseGuards(RolesGuard)
    updateQuantity(@Param('id') itemId: number, @Body() dto: CreateItemDto) {
        // const {quantity, title, itemDescription} = body;
        return this.itemsService.updateItem(itemId, dto);
    }

    @Delete('delete/:id')
    @UseGuards(RolesGuard)
    deleteItem(@Param('id') itemId: number) {
        return this.itemsService.deleteItem(itemId);
    }

    @Get('getItem/:id')
    getItem(@Param('id') itemId: number) {

    }

    @Get()
    getAllItems() {
        return this.itemsService.getAllItems();
    }
}
