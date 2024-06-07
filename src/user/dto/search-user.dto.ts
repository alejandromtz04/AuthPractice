import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator"
import { PaginateDto } from "src/global/pagination-global.dto";

export class SearchUserDto extends PartialType(PaginateDto) {
    @IsOptional()
    @IsString()
    name?: string = '';

    @IsOptional()
    @IsString()
    lastName?: string = '';

    @IsOptional()
    @IsString()
    email?: string = '';

    @IsOptional()
    @IsString()
    userName?: string = '';
}