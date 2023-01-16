import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { getConnection, Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { status } from '../../shared/entity-status.enum';
import { ReadUserDto, UpdateUserDto } from './dto';
import { plainToClass } from 'class-transformer';
import { error, log } from 'console';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ) {}

    async get(id: number): Promise<ReadUserDto>{
        if (!id){
            throw new BadRequestException("ID must be sent")
        }

        const user: User = await this.userRepository.findOne({
            where: {status: status.ACTIVE, id: id}
        });

        if (!user){
            throw new NotFoundException();
        }

        return plainToClass(ReadUserDto, user);
    }

    async getAll(): Promise<ReadUserDto[]>{
        const users: User[] = await this.userRepository.find({
            where: {status: status.ACTIVE}
        });

        return users.map( (user: ReadUserDto) => plainToClass(ReadUserDto, user));
    }

    async update(id: number, user: Partial<UpdateUserDto>): Promise<ReadUserDto>{
        const foundUser = await this.userRepository.findOne({
            where: {id, status: status.ACTIVE}
        });

        if (!foundUser){
            throw new NotFoundException("User does not exist")
        }

        foundUser.username = user.username;
        const updatedUser = await this.userRepository.save(foundUser);

        return plainToClass(ReadUserDto, updatedUser);
    }

    async delete(id: number): Promise<void>{
        const userExists: User = await this.userRepository.findOne({
            where: {status: status.ACTIVE, id: id}
        });    

        if (!userExists){
            throw new NotFoundException();
        }

        await this.userRepository.update(id, {status: status.INACTIVE});
    }

    async setRoleToUser(userId: number, roleId: number): Promise<boolean>{
        const userExists: User = await this.userRepository.findOne({
            where: {status: status.ACTIVE, id: userId}
        });    

        if (!userExists){
            throw new NotFoundException();
        }

        const roleExists: Role = await this.roleRepository.findOne({
            where: {status: status.ACTIVE, id: roleId}
        });    

        if (!roleExists){
            throw new NotFoundException("Role does not exist");
        }

        userExists.roles.push(roleExists);
        this.userRepository.save(userExists);

        return true;
    }

    

}
