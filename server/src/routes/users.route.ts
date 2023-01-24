import {Router} from 'express';
import {Routes} from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import {isAdminMiddleware} from "@middlewares/auth.middleware";
import UserController from "@controllers/user.controller";
import {CreateUserDto} from "@dtos/user.dto";

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, isAdminMiddleware,
      validationMiddleware(CreateUserDto, 'body'), this.userController.registerUser);
    this.router.get(`${this.path}`, isAdminMiddleware, this.userController.getUsers);
  }
}

export default UsersRoute;
