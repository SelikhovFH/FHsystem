import { NextFunction, Request, Response } from "express";
import DeviceService from "@services/device.service";
import { CreateDeviceDto, UpdateDeviceDto } from "@dtos/device.dto";

class DeviceController {
  private deviceService = new DeviceService();

  createDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deviceData: CreateDeviceDto = req.body;
      const data = await this.deviceService.createItem(deviceData);
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  updateDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deviceData: UpdateDeviceDto = req.body;
      const data = await this.deviceService.updateDevice(deviceData._id, deviceData, true);
      res.status(200).json({ message: "OK", data });
    } catch (error) {
      next(error);
    }
  };

  deleteDevice = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.deviceService.deleteDevice(id);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  getDevices = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.deviceService.getDevices();
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };
}

export default DeviceController;
