import { IsDateString, IsEmail, IsString, IsUrl } from "class-validator";


export class CreateClientDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsUrl()
  website;

  @IsString()
  additionalContacts;

  @IsDateString()
  workStartDate;
}

export class UpdateClientDto extends CreateClientDto {
  @IsString()
  _id: string;
}
