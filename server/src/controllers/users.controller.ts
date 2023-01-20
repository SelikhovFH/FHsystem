import {NextFunction, Request, Response} from 'express';
import {CreateUserDto} from '@dtos/users.dto';
import Auth0Service from "@services/auth0.service";

class UsersController {
  authOService = new Auth0Service()

  public registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const {user_id} = await this.authOService.createUser(userData.email)
      if (userData.isAdmin) {
        await this.authOService.assignAdminPermission(user_id)
      }
      await this.authOService.sendSignupInvitation(user_id)
      res.status(201).json({message: 'created'});
    } catch (error) {
      next(error);
    }
  };

}

export default UsersController;
