import { IsDateString, IsEmail, IsOptional, IsString, IsUrl } from "class-validator";


export class CreateClientDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsUrl()
  @IsOptional()
  website;

  @IsString()
  @IsOptional()
  additionalContacts;

  @IsDateString()
  workStartDate;
}

export class UpdateClientDto extends CreateClientDto {
  @IsString()
  _id: string;
}
