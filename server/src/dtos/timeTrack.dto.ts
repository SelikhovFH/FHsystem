import { IsBoolean, IsDateString, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateTimeTrackDto {

  @IsDateString()

  date: string;

  @IsInt()
  @Min(1)
  hours: number;

  @IsString()
  projectId: string;

  @IsBoolean()
  isMonthTrack: boolean;

  @IsString()
  @IsOptional()
  comment: string;
}

export class UpdateTimeTrackDto extends CreateTimeTrackDto {
  @IsString()
  _id: string;
}

export class GetTimeTrackDto {
  @IsDateString()
  date: string;
}
