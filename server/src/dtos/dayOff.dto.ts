import {IsEnum, IsInt, IsString} from 'class-validator';
import {DayOffStatus, DayOffType} from "@interfaces/dayOff.interface";

export class CreateDayOffDto {
  @IsString()
  public startDate: string;

  @IsString()
  public finishDate: string

  @IsEnum(DayOffType)
  public type: DayOffType
}

export class CreateDayOffBackendDto extends CreateDayOffDto {
  @IsString()
  public userId: string;

  @IsInt()
  public dayCount: number

}

export class ConfirmDayOffDto {
  @IsString()
  id: string

  @IsEnum(DayOffStatus)
  status: DayOffStatus
}
