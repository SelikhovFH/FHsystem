import { IsEnum, IsString } from "class-validator";
import { SkillTagColor } from "@interfaces/skillTag.interface";


export class CreateSkillTagDto {
  @IsString()
  name: string;

  @IsEnum(SkillTagColor)
  color?: SkillTagColor;
}

export class UpdateSkillTagDto extends CreateSkillTagDto {
  @IsString()
  _id: string;
}
