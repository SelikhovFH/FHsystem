import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isAdminMiddleware, isEditorMiddleware } from "@middlewares/auth.middleware";
import DeliveryController from "@controllers/delivery.controller";
import { CreateDeliveryDto, GetDeliveryDto, UpdateDeliveryDto } from "@dtos/delivery.dto";

class DeliveriesRoute implements Routes {
  public path = "/deliveries";
  public router = Router();
  public deliveryController = new DeliveryController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, isEditorMiddleware, validationMiddleware(GetDeliveryDto, "query"), this.deliveryController.getDeliveries);
    this.router.get(`${this.path}/my`, this.deliveryController.getMyDeliveries);
    this.router.post(`${this.path}`, isEditorMiddleware, validationMiddleware(CreateDeliveryDto, "body"), this.deliveryController.createDelivery);
    this.router.patch(`${this.path}`, isAdminMiddleware, validationMiddleware(UpdateDeliveryDto, "body"), this.deliveryController.updateDelivery);
  }
}

export default DeliveriesRoute;
