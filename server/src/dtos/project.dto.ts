import { IsArray, IsDateString, IsEnum, IsString, MaxLength } from "class-validator";
import { ProjectStatus } from "@interfaces/project.interface";


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

  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}

export class UpdateProjectDto extends CreateProjectDto {
  @IsString()
  _id: string;
}
