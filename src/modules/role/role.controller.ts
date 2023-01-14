import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { create } from 'domain';
import { Role } from './role.entity';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private readonly _roleService: RoleService){

    }

    @Get(':id')
    async getRole(@Param('id', ParseIntPipe) id: number): Promise<Role>{
        const user = await this._roleService.get(id);
        return user;
    }

    @Get()
    async getRoles(): Promise<Role[]>{
        return await this._roleService.getAll();
    }

    @Post()
    async createRole(@Body() user: Role): Promise<Role>{
        const createdRole = await this._roleService.create(user);
        return createdRole;
    }

    @Put(':id')
    async updateRole(@Param('id', ParseIntPipe) id: number, @Body() user: Role): Promise<void>{
        const updatedRole = await this._roleService.update(id,user);
        //return updatedRole;
    }

    @Delete(':id')
    async deleteRole(@Param('id', ParseIntPipe) id: number){
        return await this._roleService.delete(id);
    }
}
