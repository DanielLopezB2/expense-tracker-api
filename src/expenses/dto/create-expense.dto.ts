import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreateExpenseDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsNumber()
    @IsPositive()
    amount: number;
    
    @IsString()
    category: string;

}
