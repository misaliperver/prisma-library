import { IBusinessRule } from "@common/rule/IBussinessRule";
import { Book, User, Loan } from "@prisma/client";

export class BookMustBeExists implements IBusinessRule {
    Message: string = 'Book not exist.';
    Code: number = 404;

    constructor(
        private book: Book,
    ) {}

    IsBroken(): boolean {
        if (this.book) {
            return false;
        }

        return true;
    }
}

export class UserMustBeExists implements IBusinessRule {
    Message: string = 'User not exist.';
    Code: number = 404;

    constructor(
        private user: User,
    ) {}

    IsBroken(): boolean {
        if (this.user) {
            return false;
        }

        return true;
    }
}

export class LoanMustBeExistAbleToReturnBook implements IBusinessRule {
    Message: string = 'User have not loan.';
    Code: number = 404;

    constructor(
        private loan: Loan,
    ) {}

    IsBroken(): boolean {
        if (this.loan) {
            return false;
        }

        return true;
    }
}

export class BookOnloanFieldMustBeFalseAbleToLoan implements IBusinessRule {
    Message: string = 'Book already loanded.';
    Code: number = 404;

    constructor(
        private onloan: boolean,
    ) {}

    IsBroken(): boolean {
        return this.onloan;
    }
}

export class ScoreMustBeIntegerValueBetweenZeroAndTen implements IBusinessRule {
    Message: string = 'Score must be between 0 and 10.';
    Code: number = 500;

    constructor(
        private score: number,
    ) {}

    IsBroken(): boolean {
        if (
            this.score
            && Number.isInteger(this.score) 
            && this.score > 0 
            && this.score < 10
        ) {
            return false;
        }

        return true;
    }
}