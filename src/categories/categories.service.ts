import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {

  constructor(

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>

  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    await this.categoryRepository.save(category);
    const { updatedAt, deletedAt, ...restCategory } = category;
    
    return restCategory;
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findOne(id: string) {
    const category = this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(`Category with id: ${id} not found.`);
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {

    const { ...toUpdate } = updateCategoryDto;

    const category = await this.categoryRepository.preload({
      id,
      ...toUpdate
    });

    if (!category) throw new NotFoundException(`Category with id ${id} not found.`);
    await this.categoryRepository.save(category);
    return category;
  }

  async remove(id: string) {
    const category = await this.findOne(id);
    if (category) await this.categoryRepository.softDelete(id);
    return { message: `Category ${category?.name} deleted.` }
  }

  async removeAll() {
    await this.categoryRepository.delete({});
  }

}
