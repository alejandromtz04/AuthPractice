import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UserLoginDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(30)
    password: string;
}