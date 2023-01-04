import {UsersRepository} from "./03.repositories/users-repository";
import {UserService} from "./02.domain/users-service";

import {UsersController} from "./01.routers/users-controller";

export const usersRepository = new UsersRepository()
export const userService = new UserService(usersRepository)

export const usersController = new UsersController(userService)