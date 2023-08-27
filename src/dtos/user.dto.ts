import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class GetUserParamDto {
    @ApiProperty({
        type: Number,
        description: 'Kullanıcı id bilgisini girilmedilir.',
        example: 2,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    userId: number;
}

export class CreateUserBodyDto {
    @ApiProperty({
        type: String,
        description: 'Kullanıcı adı girilmelidir.',
        example: {
            name: 'fatih'
        },
    })
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    name: string;
}

export class BorrowBookParamDto {
    @ApiProperty({
        type: Number,
        description: 'Kullanıcı id bilgisini girilmedilir.',
        example: 2,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    userId: number;

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


export class ReturnBookBodyDto {
    @ApiProperty({
        type: Number,
        description: 'Kitap için bir değerlendirme puanı giriniz.',
        example: 2,
    })
    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    score: number;
}
