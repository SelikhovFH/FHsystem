import {IsBoolean, IsOptional, IsString} from 'class-validator';

export class CreateCalendarEventDto {
  @IsString()
  title: string
  @IsString()
  @IsOptional()
  description: string
  @IsString()
  date: string
  @IsBoolean()
  @IsOptional()
  isDayOff: boolean
  @IsBoolean()
  @IsOptional()
  isRecurring: boolean
}

export class CreateCalendarEventBackendDto extends CreateCalendarEventDto {
  @IsString()
  createdBy: string

}

export class UpdateCalendarEventDto extends CreateCalendarEventDto {
  @IsString()
  _id: string

}
