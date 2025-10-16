import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('create')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    console.log('Received DTO:', createCategoryDto);
    return this.categoriesService.create(createCategoryDto);
  }

  @Get('account/:accountId')
  findAllByAccount(@Param('accountId') accountId: number) {
    return this.categoriesService.findAllByAccount(accountId);
  }
}
