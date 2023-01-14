import { Injectable } from "@nestjs/common";
import { Repository, EntityRepository } from "typeorm";
import { Role } from "./role.entity";

@Injectable()
export class RoleRepository extends Repository<Role>{

}