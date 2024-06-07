import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator"

export class PaginateDto {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    page: number = 1;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    limit: number = 5;
}