import { IsNumber, IsNotEmpty, IsBoolean, isNotEmpty, IsString, MinLength, MaxLength, IsOptional, isString, Min, Max,  } from "class-validator";
export class CreateUserDto {
    
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(25)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(25)
    lastName: string;

    @IsNotEmpty()
    @IsNumber()
    @Min(18)
    @Max(120)
    age: number;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    userName: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(30)
    password: string;

    @IsOptional()
    @IsBoolean()
    isActivated: boolean;
}
