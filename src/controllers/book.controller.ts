import { BookService } from '@modules/book/book.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateBookBodyDto, GetBookParamDto } from 'src/dtos/book.dto';
import { PaginatedParamDto } from 'src/dtos/paginated.dto';

@Controller('books')
export class BookController {
    constructor(
        private readonly bookService: BookService,
    ) { }

    @Get()
    public async getBooks(@Query() query: PaginatedParamDto) {
        return this.bookService.books({
            skip: query.skip || 0,
            take: 10,
        });
    }

    @Get(':bookId')
    public async getBook(@Param() param: GetBookParamDto) {
        return this.bookService.book(param.bookId);
    }

    @Post()
    public async create(@Body() body: CreateBookBodyDto) {
        const bookId: number = await this.bookService.createBook({
            name: body.name,
        });

        return;
    }

}