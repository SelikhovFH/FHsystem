import { NextFunction, Request, Response } from "express";
import DeliveryService from "@services/delivery.service";
import { CreateDeliveryDto, GetDeliveryDto, UpdateDeliveryDto } from "@dtos/delivery.dto";
import ItemService from "@services/item.service";
import DeviceService from "@services/device.service";
import { HttpException } from "@exceptions/HttpException";
import { DeliveryStatus } from "@interfaces/delivery.interface";

class DeliveryController {
  private deliveryService = new DeliveryService();
  private itemService = new ItemService();
  private deviceService = new DeviceService();

  createDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryData: CreateDeliveryDto = req.body;
      this.deliveryService.validateDelivery(deliveryData);

      if (deliveryData.deviceId) {
        const device = await this.deviceService.getDeviceById(deliveryData.deviceId);
        if (device.assignedToId) {
          throw new HttpException(409, "Device is already assigned to user.");
        }
        this.deviceService.updateDevice(deliveryData.deviceId, { assignedToId: deliveryData.deliverToId });
      } else if (deliveryData.itemId) {
        const item = await this.itemService.getItemById(deliveryData.itemId);
        if (item.quantity < 1) {
          throw new HttpException(409, "Item quantity is 0");
        }
        this.itemService.updateItem(deliveryData.itemId, { quantity: item.quantity - 1 });
      }

      const data = await this.deliveryService.createDelivery(deliveryData);
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  updateDelivery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deliveryData: UpdateDeliveryDto = req.body;
      this.deliveryService.validateDelivery(deliveryData);
      const prevDelivery = await this.deliveryService.getDeliveryById(deliveryData._id);

      if (prevDelivery.status === DeliveryStatus.canceled) {
        throw new HttpException(409, `Can't edit cancelled delivery`);
      }

      if (deliveryData.status === DeliveryStatus.canceled) {
        if (prevDelivery.deviceId && prevDelivery.deviceId.toString() === deliveryData.deviceId) {
          await this.deviceService.updateDevice(deliveryData.deviceId, { assignedToId: null });
        }
        if (prevDelivery.itemId && prevDelivery.itemId.toString() === deliveryData.itemId) {
          const item = await this.itemService.getItemById(deliveryData.itemId);
          this.itemService.updateItem(deliveryData.itemId, { quantity: item.quantity + 1 });
        }
      }

      if (deliveryData.itemId !== prevDelivery.itemId?.toString()) {
        if (deliveryData.itemId) {
          const item = await this.itemService.getItemById(deliveryData.itemId);
          if (item.quantity < 1) {
            throw new HttpException(409, "Item quantity is 0");
          }
          this.itemService.updateItem(deliveryData.itemId, { quantity: item.quantity - 1 });
        }
        if (prevDelivery.itemId) {
          const prevItem = await this.itemService.getItemById(prevDelivery.itemId);
          this.itemService.updateItem(prevDelivery.itemId, { quantity: prevItem.quantity + 1 });
        }
      }

      if (deliveryData.deviceId !== prevDelivery.deviceId?.toString()) {
        if (deliveryData.deviceId) {
          const device = await this.deviceService.getDeviceById(deliveryData.deviceId);
          if (device.assignedToId) {
            throw new HttpException(409, "Device is already assigned to user.");
          }
          this.deviceService.updateDevice(deliveryData.deviceId, { assignedToId: deliveryData.deliverToId });
        }
        if (prevDelivery.deviceId) {
          this.deviceService.updateDevice(prevDelivery.deviceId, { assignedToId: null });
        }
      }

      const data = await this.deliveryService.updateDelivery(deliveryData._id, deliveryData, true);
      res.status(200).json({ message: "OK", data });
    } catch (error) {
      next(error);
    }
  };

  getDeliveries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, user } = req.query as unknown as GetDeliveryDto;
      const data = await this.deliveryService.getDeliveries(status, user);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  getMyDeliveries = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const data = await this.deliveryService.getUserDeliveries(userId);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };
}

export default DeliveryController;
