import { createParamDecorator } from "@nestjs/common";
import { UserDto } from "../user/dto/user.dto";

export const getUser = createParamDecorator((data, request): UserDto => {
    return request.user;
});