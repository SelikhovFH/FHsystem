import {NextFunction, Request, Response} from 'express';
import {CreateUserDto} from '@dtos/user.dto';
import Auth0Service from "@services/auth0.service";
import UserService from "@services/user.service";
import * as mongoose from "mongoose";
import {UserRole} from "@interfaces/user.interface";

class UserController {
  private authOService = new Auth0Service()
  private userService = new UserService()

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const mongoUserId = new mongoose.Types.ObjectId()
      const {user_id} = await this.authOService.createUser({...userData, dbId: mongoUserId.toString()})
      if (userData.role !== UserRole.editor) {
        const permissions = ['editor:editor'] as ('admin:admin' | 'editor:editor')[]
        if (userData.role === UserRole.admin) {
          permissions.push('admin:admin')
        }
        await this.authOService.assignPermissions(user_id, permissions)
      }
      const data = await this.authOService.sendSignupInvitation(user_id)
      await this.userService.createUser({auth0id: user_id, _id: mongoUserId.toString()})
      res.status(201).json({message: 'created', data});
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {page = 0, per_page = 20} = req.query;
      const users = await this.authOService.getUsers(+page, +per_page)
      res.status(200).json({data: users, message: 'OK'});
    } catch (error) {
      next(error);
    }
  };

}

export default UserController;
