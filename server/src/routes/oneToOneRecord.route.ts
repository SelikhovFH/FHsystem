import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isEditorMiddleware } from "@middlewares/auth.middleware";
import { DeleteDto } from "@dtos/common.dto";
import OneToOneRecordController from "@controllers/oneToOneRecord.controller";
import { CreateOneToOneRecordDto, GetOneToOneRecordsFullYear, UpdateOneToOneRecordDto } from "@dtos/oneToOneRecord.dto";

class OneToOneRecordRoute implements Routes {
  public path = "/one_to_one_records";
  public router = Router();
  public oneToOneRecordController = new OneToOneRecordController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, isEditorMiddleware,
      validationMiddleware(GetOneToOneRecordsFullYear, "query"), this.oneToOneRecordController.getOneToOneRecordsFullYear);
    this.router.post(`${this.path}`, isEditorMiddleware,
      validationMiddleware(CreateOneToOneRecordDto, "body"), this.oneToOneRecordController.createOneToOneRecord);
    this.router.delete(`${this.path}/:id`, isEditorMiddleware,
      validationMiddleware(DeleteDto, "params"), this.oneToOneRecordController.deleteOneToOneRecord);
    this.router.patch(`${this.path}`, isEditorMiddleware,
      validationMiddleware(UpdateOneToOneRecordDto, "body"), this.oneToOneRecordController.updateOneToOneRecord);
  }
}

export default OneToOneRecordRoute;
