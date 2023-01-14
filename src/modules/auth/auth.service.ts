import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcryptjs';
import { RoleType } from '../role/roletype.enum';
import { User } from '../user/user.entity';
import { AuthRepository } from './auth.repository';
import { SigninDto, SignupDto } from './dto';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository,
        private jwtService: JwtService
    ) {}

    async signup(signupDto: SignupDto): Promise<void>{
        const {username, email} = signupDto;
        const userExists = await this.authRepository.findOne({
            where: [{username, email}] //Or CLAUSES
        });

        if (userExists){
            throw new ConflictException("User or Email already exists");
        }

        this.authRepository.signup(signupDto);
    }

    async signin(signinDto: SigninDto): Promise<{token: string}>{
        const {username, password} = signinDto;
        const user: User = await this.authRepository.findOne({
            where: {username}
        });

        if (!user){
            throw new NotFoundException("User does not exist");
        }

        const isMatch = await compare(password, user.password);

        if (!isMatch){
            throw new UnauthorizedException("Invalid credentials");
        }

        const payload: IJwtPayload = {
            id: user.id,
            email: user.email,
            username: user.username,
            roles: user.roles.map(r => r.name as RoleType)
        }

        const token = await this.jwtService.sign(payload);
        
        return {token};
    }
}
