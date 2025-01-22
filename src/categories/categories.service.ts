import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
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
    const categories = await this.categoryRepository.find({
      where: { user: { id: user.id } }
    });

    return categories.map(({ deletedAt, user, ...rest }) => ({
      ...rest
    }));

  }

  findOne(id: string) {
    return `This action returns a #${id} category`;
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: string) {
    return `This action removes a #${id} category`;
  }
}
