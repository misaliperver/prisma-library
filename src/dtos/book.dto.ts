import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GetBookParamDto {
    @ApiProperty({
        type: Number,
        description: 'Kitap id bilgisini girilmedilir.',
        example: 2,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    bookId: number;
}

export class CreateBookBodyDto {
    @ApiProperty({
        type: String,
        description: 'Kitap adı girilmelidir.',
        example: {
            name: 'Neuromancer'
        },
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    name: string;
}