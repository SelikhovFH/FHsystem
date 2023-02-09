import { IsArray, IsDateString, IsEmail, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { UserRole, UserStatus } from "@interfaces/user.interface";

export class RegisterUserDto {
  @IsEmail()
  public email: string;

  @IsEnum(UserRole)
  public role: UserRole;
  @IsString()
  name: string;
  @IsString()
  surname: string;
}

export class UpdateUserMyDto {
  @IsString()
  name: string;
  @IsString()
  surname: string;
  @IsString()
  @IsOptional()
  phone: string;
  @IsString()
  @IsOptional()
  emergencyContact: string;
  @IsString()
  @IsOptional()
  location: string;
  @IsDateString()
  @IsOptional()
  birthDate: string;
}

export class SalaryRecord {
  @IsInt()
  value: number;

  @IsDateString()
  date: string;
}

export class UpdateUserAdminDto extends UpdateUserMyDto {
  @IsString()
  _id: string;
  @IsString()
  @IsOptional()
  title: string;
  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;
  @IsArray()
  @IsOptional()
  salaryHistory: Array<SalaryRecord>;
  @IsDateString()
  @IsOptional()
  workStartDate: string;
  @IsString()
  @IsOptional()
  cvLink: string;
}
