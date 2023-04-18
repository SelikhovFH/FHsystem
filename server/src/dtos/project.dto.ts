import { IsArray, IsDateString, IsEnum, IsString, ValidateNested } from "class-validator";
import { ProjectStatus } from "@interfaces/project.interface";
import { Type } from "class-transformer";

class ProjectWorker {
  @IsString()
  user: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectWorker)
  titles: {
    startDate: string
    finishDate: string
    rate: number
  }[];
}


export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  manager: string;

  @IsArray()
    // @ValidateNested({ each: true })
    // @Type(() => ProjectWorker)
  workers: ProjectWorker[];

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
