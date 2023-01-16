import { IsNotEmpty, IsString } from "class-validator";

export class UpdateBookDto{

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsString()
    readonly description: string;
}