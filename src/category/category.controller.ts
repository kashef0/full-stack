import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { RolesGuard } from 'src/auth/rolesGuard';

@Controller('category')
@UseGuards(JwtGuard, RolesGuard)
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Post('create')
    createCategory(@Body() dto: CreateCategoryDto) {
        return this.categoryService.createCategory(dto);
    }

    @Get()
    @UseGuards(JwtGuard)
    getAllCategories() {
        return this.categoryService.getAllCategories();
    }
}
