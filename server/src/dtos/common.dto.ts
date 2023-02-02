import {IsString} from "class-validator";

export class DeleteDto {
  @IsString()
  public id: string;

}
