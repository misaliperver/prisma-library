import { BookService } from '@modules/book/book.service';
import { UserService } from '@modules/user/user.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaginatedParamDto } from 'src/dtos/paginated.dto';
import { BorrowBookParamDto, CreateUserBodyDto, GetUserParamDto, ReturnBookBodyDto } from 'src/dtos/user.dto';

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    @Get()
    public async getUsers(@Query() query: PaginatedParamDto) {
        return this.userService.users({
            skip: query.skip || 0,
            take: 10,
        });
    }

    @Get(':userId')
    public async getUser(@Param() params: GetUserParamDto) {
        return this.userService.user(params.userId);
    }

    @Post()
    public async create(@Body() body: CreateUserBodyDto) {
        const userId = await this.userService.createUser({
            name: body.name,
        });

        return;
    }

    @Post(':userId/borrow/:bookId')
    public async borrowBook(@Param() params: BorrowBookParamDto) {
        const loanId: number = await this.userService.borrowBook({
            userId: params.userId,
            bookId: params.bookId,
        });

        return;
    }

    @Post(':userId/return/:bookId')
    public async returnBook(@Param() params: BorrowBookParamDto, @Body() body: ReturnBookBodyDto) {
        const loanId: number = await this.userService.returnBook({
            userId: params.userId,
            bookId: params.bookId,
            score: body.score,
        });

        return;
    }

}