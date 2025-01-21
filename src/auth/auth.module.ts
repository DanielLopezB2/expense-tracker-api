import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [UsersModule]
})
export class AuthModule {}
