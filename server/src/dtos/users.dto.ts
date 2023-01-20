import {IsBoolean, IsEmail, IsOptional} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsBoolean()
  @IsOptional()
  public isAdmin: boolean
}
