import { NextFunction, Request, Response } from "express";
import { RegisterUserDto, UpdateUserAdminDto, UpdateUserMyDto } from "@dtos/user.dto";
import Auth0Service from "@services/auth0.service";
import UserService from "@services/user.service";
import * as mongoose from "mongoose";
import { UserRole } from "@interfaces/user.interface";
import DeliveryService from "@services/delivery.service";

class UserController {
  private authOService = new Auth0Service();
  private userService = new UserService();
  private deliveryService = new DeliveryService();


  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: RegisterUserDto = req.body;
      const mongoUserId = new mongoose.Types.ObjectId();
      const { user_id, family_name, given_name, phone_number } = await this.authOService.createUser({
        ...userData,
        dbId: mongoUserId.toString()
      });

      if (userData.role !== UserRole.user) {
        const permissions = ["editor:editor"] as ("admin:admin" | "editor:editor")[];
        if (userData.role === UserRole.admin) {
          permissions.push("admin:admin");
        }
        await this.authOService.assignPermissions(user_id, permissions);
      }
      const data = await this.authOService.sendSignupInvitation(user_id);

      await this.userService.createUser({
        ...userData,
        auth0id: user_id,
        _id: mongoUserId.toString(),
        phone: phone_number
      });
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getUsers();
      res.status(200).json({ data: users, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  getUsersDisplayInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userService.getUsersDisplayInfo();
      res.status(200).json({ data, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const _data = await this.userService.getUserProfile(userId);
      const deliveries = await this.deliveryService.getUserDeliveries(userId);
      const data = { ..._data, deliveries };
      res.status(200).json({ data, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const userData: UpdateUserMyDto = req.body;
      const data = await this.userService.updateUser(userId, userData);
      res.status(200).json({ data, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const _data = await this.userService.getUserProfile(id);
      const deliveries = await this.deliveryService.getUserDeliveries(id);
      const data = { ..._data, deliveries };
      res.status(200).json({ data, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: UpdateUserAdminDto = req.body;
      const data = await this.userService.updateUser(userData._id, userData);
      res.status(200).json({ data, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.userService.deleteUser(id);
      await this.authOService.deleteUser(data.auth0id);

      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
