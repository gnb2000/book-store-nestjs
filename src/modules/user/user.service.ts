import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { getConnection, Repository } from 'typeorm';

import { UserRepository } from './user.repository';
import { UserDetails } from './user.details.entity';
import { Role } from '../role/role.entity';
import { status } from '../../shared/entity-status.enum';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ) {}

    async get(id: number): Promise<User>{
        if (!id){
            throw new BadRequestException("ID must be sent")
        }

        const user: User = await this.userRepository.findOne({
            where: {status: status.ACTIVE, id: id}
        });

        if (!user){
            throw new NotFoundException();
        }

        return user;
    }

    async getAll(): Promise<User[]>{
        const users: User[] = await this.userRepository.find({
            where: {status: status.ACTIVE}
        });

        return users;
    }

    async create(user: User): Promise<User>{
        const details = new UserDetails();
        user.details = details;

        const savedUser = await this.userRepository.save(user);
        return savedUser;
    }

    async update(id: number, user: User): Promise<void>{
        await this.userRepository.update(id, user);
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

    async setRoleToUser(userId: number, roleId: number){
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
