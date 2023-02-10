import { NextFunction, Request, Response } from "express";
import ItemService from "@services/item.service";
import { CreateItemDto, UpdateItemDto } from "@dtos/item.dto";

class ItemController {
  private itemService = new ItemService();

  createItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemData: CreateItemDto = req.body;
      const data = await this.itemService.createItem(itemData);
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemData: UpdateItemDto = req.body;
      const data = await this.itemService.updateItem(itemData._id, itemData);
      res.status(200).json({ message: "OK", data });
    } catch (error) {
      next(error);
    }
  };

  deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.itemService.deleteItem(id);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  getItems = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.itemService.getItems();
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };
}

export default ItemController;
