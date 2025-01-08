import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { debounceTime } from 'rxjs';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async createCategory(dto: CreateCategoryDto) {
        try {
            // Kontrollera att alla nödvändiga fält finns
            if (!dto.name || dto.name.trim() === '') {
                throw new BadRequestException('Namn på kategorin får inte vara tomt');
            }
    
            if (!dto.description || dto.description.trim() === '') {
                throw new BadRequestException('Beskrivningen får inte vara tom');
            }
    
            // Skapa kategorin
            const category = await this.prisma.category.create({
                data: {
                    name: dto.name.trim(),
                    description: dto.description.trim(),
                },
            });
    
            return category;
        } catch (error) {
            console.error('Det gick inte att skapa kategorin:', error);
            throw new InternalServerErrorException('Ett fel uppstod vid skapande av kategorin');
        }
    }
    

    async updateCategory(dto: CreateCategoryDto, categoryId: number) {
        try {
            if (!Number(categoryId) || categoryId <= 0) {
                throw new BadRequestException('Category ID måste vara ett positivt heltal');
            }
    
            // Kontrollera om kategorin existerar
            const existingCategory = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
    
            if (!existingCategory) {
                throw new NotFoundException(`Kategorin med ID ${categoryId} hittades inte`);
            }
    
            // Uppdatera kategorin
            const updatedCategory = await this.prisma.category.update({
                where: { id: categoryId },
                data: { ...dto },
            });
    
            return updatedCategory;
        } catch (error) {
            console.error('Det gick inte att uppdatera kategorin:', error);
            throw new InternalServerErrorException('Ett fel uppstod vid uppdatering av kategorin');
        }
    }
    
    
    async deleteCategory(categoryId: number) {
        try {
            if (!Number(categoryId) || categoryId <= 0) {
                throw new BadRequestException('Category ID måste vara ett positivt heltal');
            }
    
            // Kontrollera om kategorin existerar
            const existingCategory = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
    
            if (!existingCategory) {
                throw new NotFoundException(`Kategorin med ID ${categoryId} hittades inte`);
            }
    
            // Ta bort kategorin
            const deletedCategory = await this.prisma.category.delete({
                where: { id: categoryId },
            });
    
            return deletedCategory;
        } catch (error) {
            console.error('Det gick inte att ta bort kategorin:', error);
            throw new InternalServerErrorException('Ett fel uppstod vid borttagning av kategorin');
        }
    }
    
    async getCategoryById(categoryId: number) {
        try {
            if (!Number(categoryId) || categoryId <= 0) {
                throw new BadRequestException('Category ID måste vara ett positivt heltal');
            }
            // Kontrollera om kategorin existerar
            const existingCategory = await this.prisma.category.findUnique({
                where: { id: categoryId },
            });
    
            if (!existingCategory) {
                throw new NotFoundException(`Kategorin med ID ${categoryId} hittades inte`);
            }

            const getCategoryById = await this.prisma.category.findUnique({
                where: {id: categoryId},
            });

            return getCategoryById;
        } catch (error) {
            console.error('Det gick inte att hämta kategorin:', error);
            throw new InternalServerErrorException('Ett fel uppstod vid hämtning av kategorin');
        }
    }

    async getAllCategories() {
        return this.prisma.category.findMany();
    }
}
