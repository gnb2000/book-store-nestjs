import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Book } from "./book.entity";

@Injectable()
export class BookRepository extends Repository<Book>{
    constructor(private dataSource: DataSource){
        super(Book, dataSource.createEntityManager())
    }



}