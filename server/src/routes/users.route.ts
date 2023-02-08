import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isAdminMiddleware, isEditorMiddleware } from "@middlewares/auth.middleware";
import UserController from "@controllers/user.controller";
import { RegisterUserDto, UpdateUserAdminDto, UpdateUserMyDto } from "@dtos/user.dto";

class UsersRoute implements Routes {
  public path = "/users";
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/register`, isAdminMiddleware, validationMiddleware(RegisterUserDto, "body"), this.userController.registerUser);

    this.router.patch(`${this.path}/me`, validationMiddleware(UpdateUserMyDto, "body"), this.userController.updateMyProfile);
    this.router.patch(`${this.path}`, isAdminMiddleware, validationMiddleware(UpdateUserAdminDto, "body"), this.userController.updateUserProfile);

    this.router.delete(`${this.path}/:id`, isAdminMiddleware, this.userController.deleteUser);

    this.router.get(`${this.path}`, isAdminMiddleware, this.userController.getUsers);
    this.router.get(`${this.path}/display_info`, isEditorMiddleware, this.userController.getUsersDisplayInfo);
    this.router.get(`${this.path}/me`, this.userController.getMyProfile);
    this.router.get(`${this.path}/:id`, isAdminMiddleware, this.userController.getUserProfile);
  }
}

export default UsersRoute;
