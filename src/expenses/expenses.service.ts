import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Between, Repository } from 'typeorm';
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

    await this.expenseRepository.save(expense);

    const { updatedAt, deletedAt, user, category, ...restExpense } = expense;
    
    return restExpense;
  }

  async findAll(payload: JwtPayload, term: string) {

    const id = payload.id!;
    let expenses: Expense[];

    const { startDate, endDate } = this.getDateRange(term);
    expenses = await this.fetchExpensesByRange(startDate, endDate, id);

    if (term) {
      if (term === 'last_week' || term === 'last_month' || term === 'last_3_months') {
          const { startDate, endDate } = this.getDateRange(term);
          expenses = await this.fetchExpensesByRange(startDate, endDate, id);
          return this.processExpenses(expenses);
      }

      const customDateRangeMatch = term.match(/^(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2})$/);
      if (customDateRangeMatch) {
          const [_, startDateStr, endDateStr] = customDateRangeMatch;
          const startDate = new Date(startDateStr);
          const endDate = new Date(endDateStr);

          if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
              throw new BadRequestException('Invalid date format in custom range.');
          }

          expenses = await this.fetchExpensesByRange(startDate, endDate, id);
          return this.processExpenses(expenses);
      }
    }

    expenses = await this.expenseRepository.find({
        where: { user: { id } },
        relations: ['category', 'user'],
    });

    if (!expenses || expenses.length === 0) {
        return 'There is no expenses created for this user yet.';
    }

    return this.processExpenses(expenses);

  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto, payload: JwtPayload) {

    const userId = payload.id;

    const existingExpense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!existingExpense) {
      throw new NotFoundException(`Expense with id ${id} not found.`);
    }

    if (existingExpense.user.id !== userId) {
      throw new ForbiddenException(`You are not authorized to update this expense.`);
    }

    const { category: categoryName, ...toUpdate } = updateExpenseDto;

    if (categoryName) {

      const category = await this.categoryRepository.createQueryBuilder('category')
        .where('LOWER(category.name) = LOWER(:name)', { name: updateExpenseDto.category })
        .getOne();

      if (!category) {
        throw new NotFoundException(`Category with name ${categoryName} not found.`);
      }

      (toUpdate as any).category = category;

    }

    const expense = await this.expenseRepository.preload({
    id,
    ...toUpdate,
    });

    if (!expense) throw new NotFoundException(`Expense with id ${id} not found after update.`);
    await this.expenseRepository.save(expense);

    const responsePlain = {
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      createdAt: expense.createdAt,
      category: expense.category.name
    };

    return responsePlain;

  }

  async remove(id: string, payload: JwtPayload) {

    const userId = payload.id;

    const existingExpense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!existingExpense) {
      throw new NotFoundException(`Expense with id ${id} not found.`);
    }

    if (existingExpense.user.id !== userId) {
      throw new ForbiddenException(`You are not authorized to delete this expense.`);
    }

    await this.expenseRepository.softDelete(id);
    return { message: `Expense ${existingExpense?.name} deleted.` }
  }

  private getDateRange(type: string) {
    const now = new Date();
    let startDate = new Date(now);

    switch (type) {
      case 'last_week':
          startDate.setDate(now.getDate() - 7);
          break;
      case 'last_month':
          startDate.setMonth(now.getMonth() - 1);
          if (startDate.getDate() > now.getDate()) {
              startDate.setDate(now.getDate());
          }
          break;
      case 'last_3_months':
          startDate.setMonth(now.getMonth() - 3);
          if (startDate.getDate() > now.getDate()) {
              startDate.setDate(now.getDate());
          }
          break;
    }
    return { startDate, endDate: now };
  }

  private async fetchExpensesByRange(startDate: Date, endDate: Date, id: string) {
    return await this.expenseRepository.find({
      where: {
          user: { id },
          updatedAt: Between(startDate, endDate),
      },
      relations: ['category', 'user'],
    });
  }

  private processExpenses(expenses: Expense[]) {

    if (!expenses || expenses.length === 0) return 'There are no expenses to show in this range.';

    return expenses.map(expense => ({
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        createdAt: expense.createdAt,
        userName: expense.user.name,
        categoryName: expense.category.name,
    }));
  }
  
}
