import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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

    @Put('update/:id')
    updateCategory(
        @Param('id') categoryId: number,
        @Body() dto: CreateCategoryDto) {
        return this.categoryService.updateCategory(dto, categoryId);
    }

    @Delete('delete/:id')
    deleteCategory(@Param('id') categoryId: number) {
        return this.categoryService.deleteCategory(categoryId);
    }


    @Get('getCategoryById/:id')
    getCategoryById(@Param('id') categoryId: number) {
        return this.categoryService.getCategoryById(categoryId);
    }

    @Get()
    getAllCategories() {
        return this.categoryService.getAllCategories();
    }
}
function Put(arg0: string): (target: (categoryId: number, dto: CreateCategoryDto) => Promise<any>, context: ClassMethodDecoratorContext<CategoryController, (categoryId: number, dto: CreateCategoryDto) => Promise<any>> & { ...; }) => void | ((categoryId: number, dto: CreateCategoryDto) => Promise<any>) {
    throw new Error('Function not implemented.');
}

