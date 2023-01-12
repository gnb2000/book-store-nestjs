import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { create } from 'domain';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService){

    }

    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<UserDto>{
        const user = await this._userService.get(id);
        return user;
    }

    @Get()
    async getUsers(): Promise<UserDto[]>{
        return await this._userService.getAll();
    }

    @Post()
    async createUser(@Body() user: User): Promise<UserDto>{
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
}
