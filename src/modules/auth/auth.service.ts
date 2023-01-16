import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, genSalt, hash } from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import mysqlDataSource from 'src/database/datasources.config';
import { Repository } from 'typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import { RoleType } from '../role/roletype.enum';
import { UserDetails } from '../user/user.details.entity';
import { User } from '../user/user.entity';
import { UserRepository } from '../user/user.repository';
import { LoggedInDto, SigninDto, SignupDto } from './dto';
import { IJwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private authRepository: Repository<User>,
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
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

        this.signupRepo(signupDto);
    }

    async signin(signinDto: SigninDto): Promise<LoggedInDto>{
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

        const token = this.jwtService.sign(payload);
        return plainToClass(LoggedInDto, {token, user});
    }

    async signupRepo(signupDto: SignupDto){
        const {username, password, email} = signupDto;
        const user = new User();
        user.username = username;
        user.email = email;

        const defaultRole: Role = await this.roleRepository.findOne({
            where: {name: RoleType.GENERAL}
        });

        user.roles = [defaultRole];

        const details = new UserDetails();
        user.details = details;

        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        this.authRepository.save(user);
    }
}
