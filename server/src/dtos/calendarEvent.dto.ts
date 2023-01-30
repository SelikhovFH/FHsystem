import {IsBoolean, IsString} from 'class-validator';

export class CreateCalendarEventDto {
  @IsString()
  title: string
  @IsString()
  description: string
  @IsString()
  date: string
  @IsBoolean()
  isDayOff: boolean
  @IsBoolean()
  isRecurring: boolean
}

export class CreateCalendarEventBackendDto extends CreateCalendarEventDto {
  @IsString()
  createdBy: string

}

export class UpdateCalendarEventDto extends CreateCalendarEventDto {
  @IsString()
  id: string

}
