import { IsEnum, IsString } from "class-validator";
import { SkillTagCategory } from "@interfaces/skillTag.interface";


export class CreateSkillTagDto {
  @IsString()
  name: string;

  @IsEnum(SkillTagCategory)
  category?: SkillTagCategory;
}

export class UpdateSkillTagDto extends CreateSkillTagDto {
  @IsString()
  _id: string;
}
