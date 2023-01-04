import {UserService} from "../02.domain/users-service";
import {Request, Response} from "express";

export class UsersController {

  constructor(protected usersService: UserService) {

  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.usersService.getAllUsers(req.query)
    res.send(users)
  }

  async getUser() {
  }

  async createUser(req: Request, res: Response) {
    res.status(201).send(await this.usersService.createUser(req.body, true))
  }

  async deleteUser(req: Request, res: Response) {
    res.send(await this.usersService.deleteUser(req.params.id) ? 204 : 404)
  }
}