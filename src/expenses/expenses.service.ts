import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ExpensesService {

  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>
  ) {}

  async create(createExpenseDto: CreateExpenseDto) {
    return createExpenseDto;
  }

  findAll() {
    return `This action returns all expenses`;
  }

  findOne(id: string) {
    return `This action returns a #${id} expense`;
  }

  update(id: string, updateExpenseDto: UpdateExpenseDto) {
    return `This action updates a #${id} expense`;
  }

  remove(id: string) {
    return `This action removes a #${id} expense`;
  }
}
