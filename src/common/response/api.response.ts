import { ApiCode } from './api.code';
import { Nullable } from '../types/common.type';

export class ApiResponseBase<TData> {

    public readonly code: number;

    public readonly message: string;

    public readonly timestamp: number;

    public readonly data: Nullable<TData>;

    private constructor(code: number, message: string, data?: TData) {
        this.code = code;
        this.message = message;
        this.data = data || null;
        this.timestamp = Date.now();
    }

    public static success<TData>(data?: TData, message?: string): ApiResponseBase<TData> {
        const resultCode: number = ApiCode.SUCCESS.code;
        const resultMessage: string = message || ApiCode.SUCCESS.message;

        return new ApiResponseBase(resultCode, resultMessage, data);
    }

    public static error<TData>(code?: number, message?: string, data?: TData): ApiResponseBase<TData> {
        const resultCode: number = code || ApiCode.INTERNAL_ERROR.code;
        const resultMessage: string = message || ApiCode.INTERNAL_ERROR.message;

        return new ApiResponseBase(resultCode, resultMessage, data);
    }
}
