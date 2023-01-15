import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role/role.guard';
import { RoleType } from '../role/roletype.enum';
import { ReadUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService){

    }

    @Get(':id')
    @Roles(RoleType.ADMIN)
    @UseGuards(AuthGuard(), RoleGuard)
    getUser(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto>{
        return this._userService.get(id);
    }

    @Get()
    getUsers(): Promise<ReadUserDto[]>{
        return this._userService.getAll();
    }

    @Put(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto): Promise<ReadUserDto>{
        return this._userService.update(id,user);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this._userService.delete(id);
    }

    @Post('role/:userId/:roleId')
    setRoleToUser(@Param('userId', ParseIntPipe) userId: number, @Param('roleId', ParseIntPipe) roleId: number): Promise<boolean>{
        return this._userService.setRoleToUser(userId, roleId);
    }
}
