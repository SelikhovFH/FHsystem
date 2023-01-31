import {User} from '@interfaces/user.interface';
import userModel from '@models/user.model';

class UserService {
  public user = userModel;

  public async findUserById(userId: string): Promise<User> {
    const findUser: User = await this.user.findOne({_id: userId});
    return findUser;
  }

  public async createUser(data: { auth0id: string; _id: string; }): Promise<User> {
    const createUserData: User = await this.user.create(data);
    return createUserData;
  }

  // public async updateUser(userId: string, userData: CreateUserDto): Promise<User> {
  //
  //   const updateUserById: User = await this.users.findByIdAndUpdate(userId, {userData});
  //   if (!updateUserById) throw new HttpException(409, "User doesn't exist");
  //
  //   return updateUserById;
  // }

  // public async deleteUser(userId: string): Promise<User> {
  //   const deleteUserById: User = await this.users.findByIdAndDelete(userId);
  //   if (!deleteUserById) throw new HttpException(409, "User doesn't exist");
  //   return deleteUserById;
  // }
}

export default UserService;
