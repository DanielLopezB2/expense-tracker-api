import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService
    ) {}

    async login(loginUserDto: LoginUserDto) {
        const { password, email } = loginUserDto;
        const user = await this.userService.findOneByEmail(email);

        if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Invalid credentials, verify email or password.');

        const { password: _,...restUser } = user;
        return restUser;
    }
  
}
