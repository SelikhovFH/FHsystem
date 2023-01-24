import {IsEnum, IsString} from 'class-validator';
import {DayOffType} from "@interfaces/dayOff.interface";

export class CreateDayOffDto {
  @IsString()
  public startDate: string;

  @IsString()
  public finishDate: string

  @IsEnum(DayOffType)
  public type: DayOffType
}

// export class UpdateDayOffDto {
//
// }
