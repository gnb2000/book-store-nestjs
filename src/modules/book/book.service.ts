import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { In, Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { Book } from './book.entity';
import { BookRepository } from './book.repository';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dtos';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: BookRepository,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ){}

    async get(bookId: number): Promise<ReadBookDto>{
        if (!bookId){
            throw new BadRequestException('Book Id must be sent');
        }

        const book: Book = await this.bookRepository.findOne({
            where: {id: bookId, status: 'ACTIVE'}
        });

        if (!book){
            throw new NotFoundException("Book does not exist");
        }

        return plainToClass(ReadBookDto, book);
    }

    async getAll(): Promise<ReadBookDto[]>{
        const books: Book[] = await this.bookRepository.find({
            where: {status: 'ACTIVE'}
        });

        return books.map(book => plainToClass(ReadBookDto, book));
    }

    async getBookByAuthor(authorId: number): Promise<ReadBookDto[]>{
        if (!authorId){
            throw new BadRequestException("Author Id must be sent");
        }

        const books: Book[] = await this.bookRepository.findBy({
            status: 'ACTIVE', authors: In([authorId]) //Si tira error el IN hacerlo con CreateQueryBuilder en el repo
        });

        return books.map(book => plainToClass(ReadBookDto, book));
    }

    async create(book: Partial<CreateBookDto>): Promise<ReadBookDto>{
        const authors: User[] = [];

        for (const authorId of book.authors){
            const authorExists = await this.userRepository.findOne({
                where: {id: authorId, status: 'ACTIVE'}
            });

            if (!authorExists){
                throw new NotFoundException(`There is not an author with this ID: ${authorId}`);
            }

            const isAuthor = authorExists.roles.some(
                (role: Role) => role.name === RoleType.AUTHOR
            );

            if (!isAuthor){
                throw new UnauthorizedException(`This user ${authorId} is not an author`);
            }

            authors.push(authorExists);

            const savedBook: Book = await this.bookRepository.save({
                name: book.name,
                description: book.description,
                authors
            })

            return plainToClass(ReadBookDto, savedBook);
        }
    }

    async createByAuthor(book: Partial<CreateBookDto>, authorId: number): Promise<ReadBookDto>{
        const author = await this.userRepository.findOne({
            where: {id: authorId, status: 'ACTIVE'}
        })

        const isAuthor = author.roles.some(
            (role: Role) => role.name === RoleType.AUTHOR
        )

        if (!isAuthor){
            throw new UnauthorizedException(`This user ${authorId} is not an author`);
        }

        const savedBook: Book = await this.bookRepository.save({
            name: book.name,
            description: book.description,
            author
        })

        return plainToClass(ReadBookDto, savedBook);
    }

    async update(
        bookId: number,
        book: Partial<UpdateBookDto>,
        authorId: number
    ): Promise<ReadBookDto>{
        const bookExists = await this.bookRepository.findOne({
            where: {id: bookId, status: 'ACTIVE'}
        });

        if (!bookExists){
            throw new NotFoundException(`This books does not exist`);
        }

        const isOwnBook = bookExists.authors.some(author => author.id === authorId);

        if (!isOwnBook){
            throw new UnauthorizedException(`This user is not the book's author`);
        }

        bookExists.name = book.name;
        bookExists.description = book.description;
        const updatedBook = await this.bookRepository.update(bookId, bookExists);

        return plainToClass(ReadBookDto, updatedBook);
    }

    async delete(bookId: number): Promise<void>{
        const bookExists = await this.bookRepository.findOne({
            where: {id: bookId, status: 'ACTIVE'}
        });

        if (!bookExists){
            throw new NotFoundException(`This books does not exist`);
        }

        await this.bookRepository.update(bookId, {status: 'INACTIVE'});
    }

}
