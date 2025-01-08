import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { debounceTime } from 'rxjs';

@Injectable()
export class CategoryService {
    constructor(private prisma: PrismaService) {}

    async createCategory(dto: CreateCategoryDto) {
        const category = await this.prisma.category.create({
            data: {
                name: dto.name,
                description: dto.description,
            },
        });
        return category;
    }

    async updateCategory(dto: CreateCategoryDto, categoryId: number) {
        const updateCategory = await this.prisma.category.update({
            where: {
                id: categoryId,
            },
            data: {
                ...dto
            },
        });
        return updateCategory;
    }
    
    async deleteCategory(categoryId: number) {
        const deleteCategory = await this.prisma.category.delete({
            where: {
                id: categoryId,
            },
        });

        return deleteCategory;
    }

    async getAllCategories() {
        return this.prisma.category.findMany();
    }
}
