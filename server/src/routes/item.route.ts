import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isEditorMiddleware } from "@middlewares/auth.middleware";
import ItemController from "@controllers/item.controller";
import { CreateItemDto, UpdateItemDto } from "@dtos/item.dto";
import { DeleteDto } from "@dtos/common.dto";

class ItemsRoute implements Routes {
  public path = "/items";
  public router = Router();
  public itemController = new ItemController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, isEditorMiddleware, this.itemController.getItems);
    this.router.post(`${this.path}`, isEditorMiddleware, validationMiddleware(CreateItemDto, "body"), this.itemController.createItem);
    this.router.delete(`${this.path}/:id`, isEditorMiddleware, validationMiddleware(DeleteDto, "params"), this.itemController.deleteItem);
    this.router.patch(`${this.path}`, isEditorMiddleware, validationMiddleware(UpdateItemDto, "body"), this.itemController.updateItem);
  }
}

export default ItemsRoute;
