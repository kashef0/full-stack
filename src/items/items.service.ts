import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto/createItem.dto';

@Injectable()
export class ItemsService {
    constructor(private prisma: PrismaService) {}

    async createItem(dto: CreateItemDto, userId: number) {
        try {
            // Kontrollera att userId är ett positivt tal
            if (!Number(userId) || userId <= 0) {
                throw new ForbiddenException('userId måste vara ett positivt tal');
            }
    
            // Validera obligatoriska fält i DTO
            if (!dto.title || !dto.itemDescription || !dto.price || !dto.quantity || !dto.categoryId) {
                throw new BadRequestException('Alla obligatoriska fält måste fyllas i');
            }
    
            // Kontrollera att quantity är ett positivt tal
            if (dto.quantity < 0) {
                throw new ForbiddenException('quantity måste vara ett positivt tal eller noll');
            }
    
            // Kontrollera att price är ett positivt tal
            const price = dto.price;
            if (isNaN(price) || price <= 0) {
                throw new ForbiddenException('price måste vara ett giltigt positivt tal');
            }
    
            // Skapa item
            const item = await this.prisma.item.create({
                data: {
                    title: dto.title,
                    itemDescription: dto.itemDescription,
                    price: price,
                    imageUrl: dto.imageUrl || null, // Tillåt null för imageUrl
                    quantity: dto.quantity,
                    userId: userId,
                    categoryId: dto.categoryId,
                },
            });
    
            return item;
        } catch (error) {
            console.error('Det gick inte att skapa item:', error);
            throw new InternalServerErrorException('Ett fel inträffade vid skapandet av item');
        }
    }
    


    async updateItem(itemId: number, dto: CreateItemDto) {
        try {
            // Validera att itemId är ett positivt tal
            if (!Number(itemId) || itemId <= 0) {
                throw new ForbiddenException('itemId måste vara ett positivt tal');
            }
    
            // Kontrollera att mängden är ett positivt tal eller noll
            if (dto.quantity < 0) {
                throw new ForbiddenException('quantity måste vara ett positivt tal eller noll');
            }
    
            // Kontrollera om item existerar
            const existItem = await this.prisma.item.findUnique({
                where: { id: itemId },
            });
    
            if (!existItem) {
                throw new NotFoundException(`Hittades inte item med id: ${itemId}`);
            }
    
            // Uppdatera item
            const updatedItem = await this.prisma.item.update({
                where: {
                    id: itemId,
                },
                data: {
                    ...dto,
                },
            });
    
            return updatedItem;
        } catch (error) {
            console.error('Det gick inte att uppdatera item:', error);
            throw new InternalServerErrorException('Något gick fel vid uppdatering av item');
        }
    }
    

    async deleteItem(itemId: number) {
        try {
            // Validera att itemId är ett positivt tal
            if (!Number(itemId) || itemId <= 0) {
                throw new ForbiddenException('itemId måste vara ett positivt tal');
            }
    
            // Kontrollera om item existerar
            const existItem = await this.prisma.item.findUnique({
                where: { id: itemId },
            });
    
            if (!existItem) {
                throw new NotFoundException(`Hittades inte item med id: ${itemId}`);
            }
    
            // Radera item om det existerar
            const deleteItem = await this.prisma.item.delete({
                where: { id: itemId },
            });
    
            return deleteItem;
    
        } catch (error) {
            console.error('Det gick inte att ta bort item:', error);
            throw new InternalServerErrorException('Något gick fel vid borttagning av item');
        }
    }
    
    async getItem(itemId: number) {
        try {
            if (!Number(itemId) || itemId <= 0) {
                throw new ForbiddenException('itemId måste vara ett positivt tal');
            }

            const getItemById = await this.prisma.item.findUnique({
                where: {id: itemId},
            });
            return getItemById;
        } catch (error) {
             console.error('Det gick inte att hämta item:', error);
            throw new InternalServerErrorException('Något gick fel vid hämtning av item');
        }
    }

    getAllItems() {
        return this.prisma.item.findMany();

    }
}
