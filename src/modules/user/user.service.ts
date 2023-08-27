import { Injectable } from '@nestjs/common';
import { PrismaService } from '@prismamodule/prisma.service';
import { User, Loan, Prisma, Book } from '@prisma/client';
import { CheckRule } from '@common/utils/checkRule';
import { BookMustBeExists, LoanMustBeExistAbleToReturnBook, BookOnloanFieldMustBeFalseAbleToLoan, UserMustBeExists, ScoreMustBeIntegerValueBetweenZeroAndTen } from './rule';

type LoanedBook = { name: string, userScore?: number };
type UserDetails = User & { books: { present: LoanedBook[], past: LoanedBook[] } };

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) { }

    private async getValidatedBookAndUser(params: { userId: number, bookId: number }): Promise<{ user: User, book: Book }> {
        const [
            book,
            user
        ] = await Promise.all([
            this.prisma.book.findUnique({ where: { id: params.bookId } }),
            this.prisma.user.findUnique({ where: { id: params.userId } }),
        ]);

        return { book, user };
    }

    private async getValidatedActiveLoan(params: { userId: number, bookId: number }) {
        const loan = await this.prisma.loan.findFirst({
            where: {
                bookId: params.bookId,
                userId: params.userId,
                returned_at: null,
            },
        });

        return { loan };
    }

    async user(
        userId: number,
    ): Promise<UserDetails | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                loan: {
                    select: {
                        score: true,
                        book: {
                            select: {
                                name: true,
                            },
                        },
                    },
                    take: 10,
                },
            },
        });

        CheckRule(new UserMustBeExists(user));

        const userDetails = {
            id: user.id,
            name: user.name,
            books: {
                past: user.loan.filter((loan) => loan.score)
                    .map((loan): LoanedBook => ({ name: loan.book.name, userScore: loan.score })),
                present: user.loan.filter((loan) => !loan.score)
                    .map((loan): LoanedBook => ({ name: loan.book.name }))
            },
        };

        return userDetails;
    }

    async users(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.UserWhereUniqueInput;
        where?: Prisma.UserWhereInput;
        orderBy?: Prisma.UserOrderByWithRelationInput;
    }): Promise<User[]> {
        const { skip, take, cursor, where, orderBy } = params;

        return this.prisma.user.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    async createUser(data: Prisma.UserCreateInput): Promise<number> {
        const user = await this.prisma.user.create({
            data,
        });

        return user.id;
    }

    async borrowBook ({ userId, bookId }: { userId: number, bookId: number }): Promise<number> {
        const { book, user } = await this.getValidatedBookAndUser({ userId, bookId });

        CheckRule(new BookMustBeExists(book));
        CheckRule(new UserMustBeExists(user));
        CheckRule(new BookOnloanFieldMustBeFalseAbleToLoan(book.onloan));

        const loan = await this.prisma.book.update({
            where: { id: bookId },
            data: {
                onloan: true,
                loan: {
                    create: [{
                        userId: userId,
                    }],
                },
            },
        });

        return loan.id;
    }

    async returnBook ({ userId, bookId, score }: { userId: number, bookId: number, score: number }): Promise<number> {
        CheckRule(new ScoreMustBeIntegerValueBetweenZeroAndTen(score));

        const { book, user } = await this.getValidatedBookAndUser({ userId, bookId });

        CheckRule(new BookMustBeExists(book));
        CheckRule(new UserMustBeExists(user));

        const { loan } = await this.getValidatedActiveLoan({ userId, bookId });

        CheckRule(new LoanMustBeExistAbleToReturnBook(loan));

        const updatedLoan = await this.prisma.loan.update({
            where: { id: loan.id },
            data: {
                score,
                returned_at: new Date(),
                book: {
                    update: {
                        onloan: false,
                    },
                },
            },
        });

        return updatedLoan.id;
    }
}