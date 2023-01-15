import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { AuthModule } from '../auth/auth.module';
import { Role } from '../role/role.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Role]), AuthModule],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}
