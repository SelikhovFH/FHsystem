import { IsBoolean, IsDateString, IsOptional, IsString } from "class-validator";

export class CreateCalendarEventDto {
  @IsString()
  title: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsDateString()
  date: string;
  @IsBoolean()
  @IsOptional()
  isDayOff: boolean;
  @IsBoolean()
  @IsOptional()
  isRecurring: boolean;
}

export class CreateCalendarEventBackendDto extends CreateCalendarEventDto {
  @IsString()
  createdBy: string;
}

export class UpdateCalendarEventDto extends CreateCalendarEventDto {
  @IsString()
  _id: string;
}
