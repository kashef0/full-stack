import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

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

    async getAllCategories() {
        return this.prisma.category.findMany();
    }
}
