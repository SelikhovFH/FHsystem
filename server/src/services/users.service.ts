import userModel from '@models/users.model';

class UserService {
  public users = userModel;

  public async createUser({auth0id}: { auth0id: string }) {
    await this.users.create({auth0id});
  }

}

export default UserService;
