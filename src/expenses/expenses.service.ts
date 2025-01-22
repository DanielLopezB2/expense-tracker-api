import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ExpensesService {

  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) {}

  async create(createExpenseDto: CreateExpenseDto, payload: JwtPayload) {

    const categoryRelated = await this.categoryRepository.createQueryBuilder('category')
      .where('LOWER(category.name) = LOWER(:name)', { name: createExpenseDto.category })
      .getOne();

    if (!categoryRelated) throw new NotFoundException(`Category '${createExpenseDto.category}' not found`);

    const expense = this.expenseRepository.create({
      ...createExpenseDto,
      user: payload,
      category: categoryRelated
    });

    const { updatedAt, deletedAt, user, category, ...restExpense } = expense;
    
    return restExpense;
  }

  async findAll(payload: JwtPayload) {
    const id = payload.id!;
    const expenses = await this.expenseRepository.find({ where: { user: { id } } });
    if (!expenses || expenses.length === 0) return 'There is no expenses created for this user yet.';
    const expensesPlain = expenses.map((expense) => ({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      createdAt: expense.createdAt,
      userName: expense.user.name,
      categoryName: expense.category.name
    }));
    return expensesPlain;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  async remove(id: string) {
    return `This action removes a #${id} expense`;
  }
}
