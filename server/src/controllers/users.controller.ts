import {NextFunction, Request, Response} from 'express';
import {CreateUserDto} from '@dtos/users.dto';
import Auth0Service from "@services/auth0.service";

class UsersController {
  private authOService = new Auth0Service()

  registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const {user_id} = await this.authOService.createUser(userData.email, userData.isAdmin)
      if (userData.isAdmin) {
        await this.authOService.assignAdminPermission(user_id)
      }
      const data = await this.authOService.sendSignupInvitation(user_id)
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

export default UsersController;
