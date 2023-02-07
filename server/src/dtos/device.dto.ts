import { IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { deviceOwnerUnion, DeviceType } from "@interfaces/device.interface";

export class CreateDeviceDto {
  @IsString()
  name: string;
  @IsEnum(DeviceType)
  type: DeviceType;
  @IsInt()
  @IsOptional()
  screenSize?: number;
  @IsString()
  @IsOptional()
  cpu?: string;
  @IsInt()
  @IsOptional()
  ram?: number;
  @IsInt()
  @IsOptional()
  storage?: number;
  @IsString()
  @IsOptional()
  serialNumber?: string;
  @IsString()
  owner: deviceOwnerUnion;
  @IsString()
  @IsOptional()
  assignedToId: string | null;
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateDeviceDto extends CreateDeviceDto {
  @IsString()
  _id: string;
}
