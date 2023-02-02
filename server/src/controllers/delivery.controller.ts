import {NextFunction, Request, Response} from 'express';
import DeliveryService from "@services/delivery.service";
import {CreateDeliveryDto, UpdateDeliveryDto} from "@dtos/delivery.dto";
import ItemService from "@services/item.service";
import DeviceService from "@services/device.service";
import {HttpException} from "@exceptions/HttpException";
import {DeliveryStatus} from "@interfaces/delivery.interface";


class DeliveryController {
  private deliveryService = new DeliveryService()
  private itemService = new ItemService()
  private deviceService = new DeviceService()

  createDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryData: CreateDeliveryDto = req.body;
      this.deliveryService.validateDelivery(deliveryData)

      if (deliveryData.deviceId) {
        const device = await this.deviceService.getDeviceById(deliveryData.deviceId)
        if (device.assignedToId) {
          throw new HttpException(409, 'Device is already assigned to user.')
        }
        this.deviceService.updateDevice(deliveryData.deviceId, {assignedToId: deliveryData.deliverToId})
      } else if (deliveryData.itemId) {
        const item = await this.itemService.getItemById(deliveryData.itemId)
        if (item.quantity < 1) {
          throw new HttpException(409, 'Item quantity is 0')
        }
        this.itemService.updateItem(deliveryData.itemId, {quantity: item.quantity - 1})
      }

      const data = await this.deliveryService.createDelivery(deliveryData)
      res.status(201).json({message: 'created', data});
    } catch (error) {
      next(error);
    }
  };

  updateDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryData: UpdateDeliveryDto = req.body;
      this.deliveryService.validateDelivery(deliveryData)
      const prevDelivery = await this.deliveryService.getDeliveryById(deliveryData._id)

      if (deliveryData.status === DeliveryStatus.canceled && prevDelivery.status !== DeliveryStatus.canceled) {
        await this.deviceService.updateDevice(deliveryData.deviceId, {assignedToId: null})
        const item = await this.itemService.getItemById(deliveryData.itemId)
        this.itemService.updateItem(deliveryData.itemId, {quantity: item.quantity + 1})
      }

      if (deliveryData.itemId !== prevDelivery.itemId) {
        const item = await this.itemService.getItemById(deliveryData.itemId)
        if (item.quantity < 1) {
          throw new HttpException(409, 'Item quantity is 0')
        }
        const prevItem = await this.itemService.getItemById(prevDelivery.itemId)
        this.itemService.updateItem(deliveryData.itemId, {quantity: item.quantity - 1})
        this.itemService.updateItem(prevDelivery.itemId, {quantity: prevItem.quantity + 1})
      } else if (deliveryData.deviceId !== prevDelivery.deviceId) {
        const device = await this.deviceService.getDeviceById(deliveryData.deviceId)
        if (device.assignedToId) {
          throw new HttpException(409, 'Device is already assigned to user.')
        }
        this.deviceService.updateDevice(deliveryData.deviceId, {assignedToId: deliveryData.deliverToId})
        this.deviceService.updateDevice(prevDelivery._id, {assignedToId: null})
      }

      const data = await this.deliveryService.updateDelivery(deliveryData._id, deliveryData)
      res.status(200).json({message: 'OK', data});
    } catch (error) {
      next(error);
    }
  };

  getDeliveries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.deliveryService.getDeliveries()
      res.status(200).json({message: 'ok', data});
    } catch (error) {
      next(error);
    }
  };


  getMyDeliveries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string
      const data = await this.deliveryService.getUserDeliveries(userId)
      res.status(200).json({message: 'ok', data});
    } catch (error) {
      next(error);
    }
  };

}

export default DeliveryController;
