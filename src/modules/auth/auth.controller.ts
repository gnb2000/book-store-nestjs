import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('/signup')
    @UsePipes(ValidationPipe) //Se asegura de aplicar las validaciones que pusimos en el DTO
    async signup(@Body() signupDto: SignupDto): Promise<void>{
        return this.authService.signup(signupDto);
    }

    @Post('/signin')
    @UsePipes(ValidationPipe) //Se asegura de aplicar las validaciones que pusimos en el DTO
    async signin(@Body() signinDto: SigninDto){
        return this.authService.signin(signinDto);
    }
}
