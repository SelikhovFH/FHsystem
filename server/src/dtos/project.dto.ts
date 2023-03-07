import { IsArray, IsDateString, IsString, MaxLength } from "class-validator";


export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  manager: string;

  @IsArray()
  @MaxLength(50, {
    each: true
  })
  workers: string[];

  @IsDateString()
  startDate: string;

  @IsString()
  client: string;
}

export class UpdateProjectDto extends CreateProjectDto {
  @IsString()
  _id: string;
}
