import { BusinessRuleValidationException } from "@common/exception/BusinessRuleValidationException";
import { IBusinessRule } from "@common/rule/IBussinessRule";

export function CheckRule(rule: IBusinessRule) {
    if (rule.IsBroken()) {
        throw new BusinessRuleValidationException(rule);
    }
}