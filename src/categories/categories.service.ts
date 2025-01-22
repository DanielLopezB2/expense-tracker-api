import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

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

  async findAll(user: JwtPayload) {
    const categories = await this.categoryRepository.find();

    return categories;
  }
}
