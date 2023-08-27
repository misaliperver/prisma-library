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
