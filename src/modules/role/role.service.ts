import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';

import { Role } from '../role/role.entity';

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ) {}

    async get(id: number): Promise<Role>{
        if (!id){
            throw new BadRequestException("ID must be sent")
        }

        const role: Role = await this.roleRepository.findOne({
            where: {status: 'ACTIVE', id: id}
        });

        if (!role){
            throw new NotFoundException();
        }

        return role;
    }

    async getAll(): Promise<Role[]>{
        const roles: Role[] = await this.roleRepository.find({
            where: {status: 'ACTIVE'}
        });

        return roles;
    }

    async create(role: Role): Promise<Role>{
        const savedRole = await this.roleRepository.save(role);
        
        return savedRole;
    }

    async update(id: number, role: Role): Promise<void>{
        await this.roleRepository.update(id, role);
    }

    async delete(id: number): Promise<void>{
        const roleExists: Role = await this.roleRepository.findOne({
            where: {status: 'ACTIVE', id: id}
        });    

        if (!roleExists){
            throw new NotFoundException();
        }

        await this.roleRepository.update(id, {status: 'INACTIVE'});
    }

    

}