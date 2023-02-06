import deliveryModel from "@models/delivery.model";
import {CreateDeliveryDto, UpdateDeliveryDto} from "@dtos/delivery.dto";
import {Delivery} from "@interfaces/delivery.interface";
import {HttpException} from "@exceptions/HttpException";

class DeliveryService {
  private delivery = deliveryModel;

  public async createDelivery(data: CreateDeliveryDto): Promise<Delivery> {
    return this.delivery.create(data);
  }

  public async updateDelivery(_id: string, data: Partial<UpdateDeliveryDto>, force?: boolean): Promise<Delivery> {
    if (force) {
      return this.delivery.findOneAndReplace({_id}, data);
    }
    return this.delivery.findOneAndUpdate({_id}, data);
  }

  public async getDeliveryById(_id: string,): Promise<Delivery> {
    return this.delivery.findOne({_id});
  }

  public async getDeliveries(): Promise<Delivery[]> {
    return this.delivery.aggregate()
      .lookup({
        from: "users",
        as: "deliverToUser",
        localField: "deliverToId",
        foreignField: "_id"
      })
      .lookup({
        from: "items",
        as: "item",
        localField: "itemId",
        foreignField: "_id"
      })
      .lookup({
        from: "devices",
        as: "device",
        localField: "deviceId",
        foreignField: "_id"
      })
      .unwind({
        path: "$deliverToUser",
        preserveNullAndEmptyArrays: true
      })
      .unwind({
        path: "$item",
        preserveNullAndEmptyArrays: true
      })
      .unwind({
        path: "$device",
        preserveNullAndEmptyArrays: true
      })
      .exec()
  }

  public async getUserDeliveries(userId: string): Promise<Delivery[]> {
    return this.delivery.aggregate()
      .match({
        deliverToId: userId
      })
      .lookup({
        from: "items",
        as: "item",
        localField: "itemId",
        foreignField: "_id"
      })
      .lookup({
        from: "devices",
        as: "device",
        localField: "deviceId",
        foreignField: "_id"
      })
      .unwind({
        path: "$item"
      })
      .unwind({
        path: "$device"
      })
      .exec()
  }


  public validateDelivery(data: CreateDeliveryDto): boolean {
    let payloadCount = 0
    data.deviceId && payloadCount++
    data.itemId && payloadCount++
    data.customItem && payloadCount++

    if (payloadCount === 0) {
      throw new HttpException(400, 'No payload was assigned to delivery')
    }

    if (payloadCount > 1) {
      throw new HttpException(400, 'You cannnot assign multiple items to one delivery')
    }
    return true
  }

}

export default DeliveryService;
