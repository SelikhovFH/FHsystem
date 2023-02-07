import { IsOptional, IsString } from "class-validator";

export class DeleteDto {
  @IsString()
  public id: string;
}

export class PaginationDto {
  @IsString()
  @IsOptional()
  page: string;

  @IsString()
  @IsOptional()
  per_page: string;
}
