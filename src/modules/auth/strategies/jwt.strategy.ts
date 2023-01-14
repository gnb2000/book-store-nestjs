import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthRepository } from "../auth.repository";
import { IJwtPayload } from "../jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(AuthRepository)
        private authRepository: AuthRepository
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.SECRET
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