import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggedInDto, SigninDto, SignupDto } from './dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('/signup')
    @UsePipes(ValidationPipe) //Se asegura de aplicar las validaciones que pusimos en el DTO
    signup(@Body() signupDto: SignupDto): Promise<void>{
        return this.authService.signup(signupDto);
    }

    @Post('/signin')
    @UsePipes(ValidationPipe) //Se asegura de aplicar las validaciones que pusimos en el DTO
    signin(@Body() signinDto: SigninDto): Promise<LoggedInDto>{
        return this.authService.signin(signinDto);
    }
}
