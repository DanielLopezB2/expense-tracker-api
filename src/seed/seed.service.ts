import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { CategoriesService } from 'src/categories/categories.service';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

@Injectable()
export class SeedService {

  constructor(
    private readonly categoriesService: CategoriesService
  ) { }

  private categoriesList: CreateCategoryDto[] = [
    {
      name: 'Groceries'
    },
    {
      name: 'Leisure'
    },
    {
      name: 'Electronics'
    },
    {
      name: 'Utilities'
    },
    {
      name: 'Clothing'
    },
    {
      name: 'Health'
    },
    {
      name: 'Others'
    }
  ];

  async seed() {

    await this.categoriesService.removeAll();

    const categories = this.categoriesList;

    categories.forEach(async category => {
      await this.categoriesService.create(category)
    });
    return { message: 'Seed executed.' };
  }

}
