import { Transform } from "class-transformer";
import { IsIn, IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreateExpenseDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsNumber()
    @IsPositive()
    amount: number;
    
    @IsString()
    @Transform(({ value }) => value?.toLowerCase())
    @IsIn(['groceries', 'leisure', 'utilities', 'health', 'electronics', 'clothing', 'others'])
    category: string;

}
