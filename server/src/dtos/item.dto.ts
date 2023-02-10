import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { ItemSize } from "@interfaces/item.interface";

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  quantity: number;

  @IsEnum(ItemSize)
  @IsOptional()
  size?: ItemSize;
}

export class UpdateItemDto extends CreateItemDto {
  @IsString()
  _id: string;
}
