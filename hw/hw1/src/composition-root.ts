import 'reflect-metadata'
import { UsersRepository } from './03.repositories/users-repository'
import { UserService } from './02.domain/users-service'

import { UsersController } from './01.routers/users-controller'
import { Container } from 'inversify'

/* const objects: any[] = []

export const usersRepository = new UsersRepository()

objects.push(usersRepository)
export const userService = new UserService(usersRepository)
objects.push(userService)

export const usersController = new UsersController(userService)
objects.push(usersController)

export const ioc = {
  getInstance<T>(ClassType: any) {
    const targetInstance = objects.find(o => o instanceof ClassType)
    return targetInstance as T
  }
} */

export const container = new Container()
container.bind<UsersRepository>(UsersRepository).to(UsersRepository)
container.bind<UsersController>(UsersController).to(UsersController)
container.bind<UserService>(UserService).to(UserService)
