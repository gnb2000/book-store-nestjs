import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/user.decorator';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role/role.guard';
import { RoleType } from '../role/roletype.enum';
import { BookService } from './book.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';

@Controller('books')
export class BookController {
    constructor(private bookService: BookService){}

    @Get(':id')
    getBook(@Param('id', ParseIntPipe) id: number): Promise<ReadBookDto> {
        return this.bookService.get(id);
    }

    @Get('author/:authorId')
    getBooksByAuthor(@Param('authorId', ParseIntPipe) authorId: number): Promise<ReadBookDto[]> {
        return this.bookService.getBookByAuthor(authorId);
    }

    @Get()
    getBooks(): Promise<ReadBookDto[]> {
        return this.bookService.getAll();
    }

    @Post()
    @Roles(RoleType.AUTHOR)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    createBook(@Body() book: Partial<CreateBookDto>): Promise<ReadBookDto>{
        return this.bookService.create(book);
    }

    @Roles(RoleType.AUTHOR)
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Post()
    createBookByAuthor(@Body() book: Partial<CreateBookDto>, @GetUser('id') authorId: number): Promise<ReadBookDto>{
        return this.bookService.createByAuthor(book, authorId);
    }

    @Put(':id')
    updateBook(
        @Param('id', ParseIntPipe) id: number,
        @Body() book: Partial<UpdateBookDto>,
        @GetUser('id') authorId: number
    ): Promise<ReadBookDto>{
        return this.bookService.update(id,book,authorId);
    }

    @Delete(':id')
    deleteBook(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.bookService.delete(id);
    }
}
