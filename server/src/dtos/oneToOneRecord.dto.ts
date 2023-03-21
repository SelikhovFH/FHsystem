import { IsDateString, IsInt, IsString, Max, Min } from "class-validator";
import { Impression } from "@interfaces/oneToOneRecord.interface";


export class CreateOneToOneRecordDto {
  @IsString()
  creator: string;
  @IsString()
  user: string;
  @IsDateString()
  date: string;
  @IsString()
  notes: string;

  @IsInt()
  @Min(1)
  @Max(5)
  impression: Impression;
}

export class GetOneToOneRecordsFullYear {
  @IsDateString()
  date: string;
}

export class UpdateOneToOneRecordDto extends CreateOneToOneRecordDto {
  @IsString()
  _id: string;
}
