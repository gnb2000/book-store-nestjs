import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/modules/user/user.entity";
import { UserRepository } from "src/modules/user/user.repository";
import { Repository } from "typeorm";
import { IJwtPayload } from "../jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(User)
        private authRepository: Repository<User>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });
    };

    async validate(payload: IJwtPayload){
        const { username } = payload;
        const user = await this.authRepository.findOne({
            where: {username, status: 'ACTIVE'}
        })

        if (!user){
            throw new UnauthorizedException();
        }

        return payload;
    }
}