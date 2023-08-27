import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional } from "class-validator";

export class PaginatedParamDto {
    @ApiProperty({
        type: Number,
        description: 'Sayfalama için geçilecek row sayısı girilmelidir.',
        example: 10,
    })
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    skip?: number;
}
