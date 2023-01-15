import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass, plainToInstance } from 'class-transformer';
import { getConnection, Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos';
import { status } from '../../shared/entity-status.enum';


@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>
    ) {}

    async get(id: number): Promise<ReadRoleDto>{
        if (!id){
            throw new BadRequestException("ID must be sent")
        }

        const role: Role = await this.roleRepository.findOne({
            where: {status: status.ACTIVE, id: id}
        });

        if (!role){
            throw new NotFoundException();
        }

        //ClassToPlain: DTO TO ENTITY
        return plainToInstance(ReadRoleDto, role);
    }

    async getAll(): Promise<ReadRoleDto[]>{
        const roles: Role[] = await this.roleRepository.find({
            where: {status: 'ACTIVE'}
        });

        return roles.map((role: Role) => plainToInstance(ReadRoleDto, role));
    }

    async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto>{
        const savedRole = await this.roleRepository.save(role);
        
        return plainToClass(ReadRoleDto, savedRole);
    }

    async update(roleId: number, role: Partial<UpdateRoleDto>): Promise<ReadRoleDto>{
        const foundRole: Role = await this.roleRepository.findOne({
            where: {id: roleId, status: status.ACTIVE}
        });

        if (!foundRole){
            throw new NotFoundException("Role does not exist")
        }
        foundRole.name = role.name;
        foundRole.description = role.description;
        const updatedRole: Role = await this.roleRepository.save(foundRole);

        return plainToClass(ReadRoleDto, updatedRole);
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