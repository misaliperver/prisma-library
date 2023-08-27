export interface IBusinessRule {
    readonly Message: string;
    readonly Code: number;

    IsBroken(): boolean;
}
