import { IsString } from "class-validator";

export class MarkNotificationAsReadDto {
  @IsString()
  id: string;
}
