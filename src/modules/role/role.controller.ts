import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dtos';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private readonly _roleService: RoleService){

    }

    @Get(':id')
    getRole(@Param('id', ParseIntPipe) id: number): Promise<ReadRoleDto>{
        return this._roleService.get(id);
    }

    @Get()
    getRoles(): Promise<ReadRoleDto[]>{
        return this._roleService.getAll();
    }

    @Post()
    createRole(@Body() user: Partial<CreateRoleDto>): Promise<ReadRoleDto>{
        return this._roleService.create(user);
    }

    @Put(':id')
    updateRole(@Param('id', ParseIntPipe) id: number, @Body() role: Partial<UpdateRoleDto>): Promise<ReadRoleDto>{
        return this._roleService.update(id,role);
    }

    @Delete(':id')
    deleteRole(@Param('id', ParseIntPipe) id: number){
        return this._roleService.delete(id);
    }
}
