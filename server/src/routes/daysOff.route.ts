import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isEditorMiddleware } from "@middlewares/auth.middleware";
import DayOffController from "@controllers/dayOff.controller";
import { ConfirmDayOffDto, CreateDayOffDto, CreateDayOffEditorDto, UpdateDayOffEditorDto } from "@dtos/dayOff.dto";
import { DeleteDto } from "@dtos/common.dto";

class DaysOffRoute implements Routes {
  public path = "/days_off";
  public router = Router();
  public dayOffController = new DayOffController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, isEditorMiddleware, validationMiddleware(CreateDayOffEditorDto, "body"), this.dayOffController.createDayOff);
    this.router.patch(`${this.path}`, isEditorMiddleware, validationMiddleware(UpdateDayOffEditorDto, "body"), this.dayOffController.updateDayOff);
    this.router.delete(`${this.path}`, isEditorMiddleware, validationMiddleware(DeleteDto, "params"), this.dayOffController.deleteDayOff);
    this.router.get(`${this.path}`, isEditorMiddleware, this.dayOffController.getDayOffs);

    this.router.post(`/my${this.path}`, validationMiddleware(CreateDayOffDto, "body"), this.dayOffController.createDayOffMy);
    this.router.get(`${this.path}/pending`, isEditorMiddleware, this.dayOffController.getPendingDaysOff);
    this.router.get(`${this.path}/my`, this.dayOffController.getMyDaysOff);
    this.router.get(`${this.path}/my/usage`, this.dayOffController.getMyDaysOffUsage);
    this.router.patch(
      `${this.path}/confirm`,
      isEditorMiddleware,
      validationMiddleware(ConfirmDayOffDto, "body"),
      this.dayOffController.confirmDayOff
    );
  }
}

export default DaysOffRoute;
