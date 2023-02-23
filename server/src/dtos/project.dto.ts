import { IsString } from "class-validator";


export class CreateProjectDto {
  @IsString()
  name: string;

}

export class UpdateProjectDto extends CreateProjectDto {
  @IsString()
  _id: string;
}
