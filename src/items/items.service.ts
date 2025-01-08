import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto/createItem.dto';

@Injectable()
export class ItemsService {
    constructor(private prisma: PrismaService) {}

    async createItem(dto: CreateItemDto, userId: number) {
        const item = await this.prisma.item.create({
            data: {
                title: dto.title,
                itemDescription: dto.itemDescription,
                price: parseFloat(dto.price),
                imageUrl: dto.imageUrl,
                quantity: dto.quantity,
                userId: userId,
                categoryId: dto.categoryId,
            },
        });
        return item;
    }


    async updateItem(itemId: number, quantity: number, title: string, itemDescription: string) {
        const updateItem = await this.prisma.item.update({
            where: {
                id: itemId,
            },
            data: {
                title,
                quantity,
                itemDescription,
            },
        });
        return updateItem;
    }

    async deleteItem(itemId: number) {
        const deleteItem = await this.prisma.item.delete({
            where: {
                id: itemId,
            },
        });
        return deleteItem
    }

    getAllItems() {
        return this.prisma.item.findMany();

    }
}
