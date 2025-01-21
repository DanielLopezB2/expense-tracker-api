import { IsString, MinLength, IsEmail, MaxLength, Matches } from "class-validator";

export class LoginUserDto {
    
    @IsEmail()
    email: string;

    @IsString()
    password: string;

}
