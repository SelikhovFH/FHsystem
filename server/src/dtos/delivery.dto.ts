import {IsEnum, IsOptional, IsString} from 'class-validator';
import {DeliveryStatus} from "@interfaces/delivery.interface";

export class CreateDeliveryDto {
  @IsEnum(DeliveryStatus)
  status: DeliveryStatus
  @IsString()
  deliverToId: string
  @IsString()
  @IsOptional()
  deliveryCode?: string
  @IsString()
  @IsOptional()
  itemId?: string
  @IsString()
  @IsOptional()
  deviceId?: string
  @IsString()
  @IsOptional()
  customItem?: string
  @IsString()
  @IsOptional()
  description?: string
  @IsString()
  @IsOptional()
  estimatedDeliveryTime?: string
}

export class UpdateDeliveryDto extends CreateDeliveryDto {
  @IsString()
  _id: string

}
