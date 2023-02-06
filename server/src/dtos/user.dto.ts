import {IsEmail, IsEnum} from 'class-validator';
import {UserRole} from "@interfaces/user.interface";

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsEnum(UserRole)
  public role: UserRole
}

