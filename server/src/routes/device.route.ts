import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isAdminMiddleware, isEditorMiddleware } from "@middlewares/auth.middleware";
import { DeleteDto } from "@dtos/common.dto";
import DeviceController from "@controllers/device.controller";
import { CreateDeviceDto, UpdateDeviceDto } from "@dtos/device.dto";

class DevicesRoute implements Routes {
  public path = "/devices";
  public router = Router();
  public deviceController = new DeviceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, isEditorMiddleware, this.deviceController.getDevices);
    this.router.post(`${this.path}`, isEditorMiddleware, validationMiddleware(CreateDeviceDto, "body"), this.deviceController.createDevice);
    this.router.delete(`${this.path}/:id`, isAdminMiddleware, validationMiddleware(DeleteDto, "params"), this.deviceController.deleteDevice);
    this.router.patch(`${this.path}`, isAdminMiddleware, validationMiddleware(UpdateDeviceDto, "body"), this.deviceController.updateDevice);
  }
}

export default DevicesRoute;
