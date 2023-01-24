import {IsEnum, IsString} from 'class-validator';
import {DayOffStatus, DayOffType} from "@interfaces/dayOff.interface";

export class CreateDayOffDto {
  @IsString()
  public startDate: string;

  @IsString()
  public finishDate: string

  @IsEnum(DayOffType)
  public type: DayOffType
}

export class ConfirmDayOffDto {
  @IsString()
  id: string

  @IsEnum(DayOffStatus)
  status: DayOffStatus
}
