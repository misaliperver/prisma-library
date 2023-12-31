import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prismamodule/prisma.service';
import { Book, User, Prisma } from '@prisma/client';
import { CheckRule } from '@common/utils/checkRule';
import { BookMustBeExists } from './rule';

type BookDetails = Omit<Book & { score?: string|number }, 'onloan'>;

@Injectable()
export class BookService {
    constructor(private readonly prisma: PrismaService) { }

    private async bookAvarageScoreAggregation(
        bookId: number
    ): Promise<string | number | null> {
        const avgResult = await this.prisma.loan.aggregate({
            _avg: {
                score: true,
            },
            where: {
                bookId: bookId,
                NOT: [{ score: null }],
            }
        });

        return avgResult._avg.score ? avgResult._avg.score.toFixed(2) : -1;
    }

    async book(
        bookId: number,
    ): Promise<BookDetails | null> {
        const [
            book,
            score,
        ] = await Promise.all([
            this.prisma.book.findUnique({ where: { id: bookId } }),
            this.bookAvarageScoreAggregation(bookId),
        ]);

        CheckRule(new BookMustBeExists(book));

        return { id: book.id, name: book.name, score };
    }

    async books(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.BookWhereUniqueInput;
        where?: Prisma.BookWhereInput;
        orderBy?: Prisma.BookOrderByWithRelationInput;
    }): Promise<BookDetails[]> {
        const { skip, take, cursor, where, orderBy } = params;

        return this.prisma.book.findMany({
            select: {
                id: true,
                name: true,
            },
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async createBook(data: Prisma.BookCreateInput): Promise<number> {
        const book = await this.prisma.book.create({ data });

        return book.id;
    }
}