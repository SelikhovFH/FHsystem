import {Router} from 'express';
import UsersController from '@controllers/users.controller';
import {CreateUserDto} from '@dtos/users.dto';
import {Routes} from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import {isAdminMiddleware} from "@middlewares/auth.middleware";

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, isAdminMiddleware,
      validationMiddleware(CreateUserDto, 'body'), this.usersController.registerUser);
  }
}

export default UsersRoute;
