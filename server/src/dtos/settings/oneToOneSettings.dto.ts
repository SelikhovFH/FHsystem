import { IsArray, IsEnum, IsString, ValidateNested } from "class-validator";
import { OneToOneSettingsPeriod } from "@interfaces/settings/oneToOneSettings";
import { Type } from "class-transformer";


class UserSpecificPeriod {
  @IsString()
  userId: string;

  @IsEnum(OneToOneSettingsPeriod)
  period: OneToOneSettingsPeriod;
}

export class OneToOneSettingsDto {

  @IsEnum(OneToOneSettingsPeriod)
  period: OneToOneSettingsPeriod;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UserSpecificPeriod)
  userSpecificPeriods: {
    userId: string,
    period: OneToOneSettingsPeriod
  }[];

}
