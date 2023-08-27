import { ApiResponseBase } from '../response/api.response';
import { ApiCode } from '../response/api.code';
import { Exception } from '../exception/exception';
import { ApiServerConfig } from '../../apiserver.config';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger, UnauthorizedException } from '@nestjs/common';
import { Request, Response } from 'express';
import { BusinessRuleValidationException } from '@common/exception/BusinessRuleValidationException';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {

    public catch(error: Error, host: ArgumentsHost): void {
        const request: Request = host.switchToHttp().getRequest();
        const response: Response = host.switchToHttp().getResponse<Response>();

        let errorResponse: ApiResponseBase<unknown> = ApiResponseBase.error(ApiCode.INTERNAL_ERROR.code, error.message);

        errorResponse = this.handleNestError(error, errorResponse);
        errorResponse = this.handleCoreException(error, errorResponse);

        if (ApiServerConfig.LOG_ENABLE) {
            const message: string =
                `Method: ${request.method}; ` +
                `Path: ${request.path}; ` +
                `Error: ${errorResponse.message}`;

            Logger.error(message);
        }

        response.status(errorResponse.code || 500);

        response.json(errorResponse);
    }

    private handleNestError(error: Error, errorResponse: ApiResponseBase<unknown>): ApiResponseBase<unknown> {
        if (error instanceof HttpException) {
            errorResponse = ApiResponseBase.error(error.getStatus(), error.message, null);
        }
        if (error instanceof UnauthorizedException) {
            errorResponse = ApiResponseBase.error(ApiCode.UNAUTHORIZED_ERROR.code, ApiCode.UNAUTHORIZED_ERROR.message, null);
        }

        return errorResponse;
    }

    private handleCoreException(error: Error, errorResponse: ApiResponseBase<unknown>): ApiResponseBase<unknown> {
        if (error instanceof Exception) {
            errorResponse = ApiResponseBase.error(error.code, error.message, error.data);
        }

        if (error instanceof BusinessRuleValidationException) {
            errorResponse = ApiResponseBase.error(error.BrokenRule.Code, error.message, error.BrokenRule.Message);
        }

        return errorResponse;
    }

}
