import { Injectable } from "@nestjs/common";
import { genSalt, hash } from "bcryptjs";
import mysqlDataSource from "src/database/datasources.config";
import { Repository } from "typeorm";
import { Role } from "../role/role.entity";
import { RoleRepository } from "../role/role.repository";
import { RoleType } from "../role/roletype.enum";
import { UserDetails } from "../user/user.details.entity";
import { User } from "../user/user.entity";
import { SignupDto } from "./dto";

@Injectable()
export class AuthRepository extends Repository<User>{

    async signup(signupDto: SignupDto){
        const {username, password, email} = signupDto;
        const user = new User();
        user.username = username;
        user.email = email;

        const roleRepository: RoleRepository = await mysqlDataSource.getRepository(Role);
        const defaultRole: Role = await roleRepository.findOne({
            where: {name: RoleType.GENERAL}
        });

        user.roles = [defaultRole];

        const details = new UserDetails();
        user.details = details;

        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        await user.save();
    }

}