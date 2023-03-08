import { IsDateString, IsString } from "class-validator";


export class CreateOneToOneRecordDto {
  @IsString()
  creator: string;
  @IsString()
  user: string;
  @IsDateString()
  date: string;
  @IsString()
  notes: string;
}

export class GetOneToOneRecordsFullYear {
  @IsDateString()
  date: string;
}

export class UpdateOneToOneRecordDto extends CreateOneToOneRecordDto {
  _id: string;
}
