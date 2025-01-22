import { Controller, Post, HttpStatus, HttpCode, UseGuards } from '@nestjs/common';
import { SeedService } from './seed.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('seed')
export class SeedController {

  constructor(private readonly seedService: SeedService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  seed() {
    return this.seedService.seed();
  }

}
