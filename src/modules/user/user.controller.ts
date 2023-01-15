import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { create } from 'domain';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService){

    }

    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<User>{
        const user = await this._userService.get(id);
        return user;
    }

    @UseGuards(AuthGuard())
    @Get()
    async getUsers(): Promise<User[]>{
        return await this._userService.getAll();
    }

    @Post()
    async createUser(@Body() user: User): Promise<User>{
        const createdUser = await this._userService.create(user);
        return createdUser;
    }

    @Put(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User): Promise<void>{
        const updatedUser = await this._userService.update(id,user);
        //return updatedUser;
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number){
        return await this._userService.delete(id);
    }

    @Post('role/:userId/:roleId')
    async setRoleToUser(@Param('userId', ParseIntPipe) userId: number, @Param('roleId', ParseIntPipe) roleId: number){
        return this._userService.setRoleToUser(userId, roleId);
    }
}
