import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createExpenseDto: CreateExpenseDto, @GetUser() payload: JwtPayload) {
    return this.expensesService.create(createExpenseDto, payload);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@GetUser() payload: JwtPayload, @Query('filter') term: string) {
    return this.expensesService.findAll(payload, term);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateExpenseDto: UpdateExpenseDto, @GetUser() payload: JwtPayload) {
    return this.expensesService.update(id, updateExpenseDto, payload);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string, @GetUser() payload: JwtPayload) {
    return this.expensesService.remove(id, payload);
  }
}
