import { IBusinessRule } from "../rule/IBussinessRule"

export class BusinessRuleValidationException extends Error {
    public readonly BrokenRule: IBusinessRule;
    
    constructor (brokenRule: IBusinessRule) {
        super(brokenRule.Message);
        
        this.BrokenRule = brokenRule;

        Error.captureStackTrace(this, this.constructor)
    }
    

    public ToString(): string {
        return `${this.BrokenRule.constructor.name}(${this.BrokenRule.Code}): ${this.message}`
    }
}