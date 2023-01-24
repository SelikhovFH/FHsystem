import {Router} from 'express';
import {Routes} from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import {isAdminMiddleware} from "@middlewares/auth.middleware";
import DayOffController from "@controllers/dayOff.controller";
import {ConfirmDayOffDto, CreateDayOffDto} from "@dtos/dayOff.dto";

class DaysOffRoute implements Routes {
  public path = '/days_off';
  public router = Router();
  public dayOffController = new DayOffController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`,
      validationMiddleware(CreateDayOffDto, 'body'), this.dayOffController.createDayOff);
    this.router.get(`${this.path}/pending`, isAdminMiddleware, this.dayOffController.getPendingDaysOff);
    this.router.get(`${this.path}/my`, this.dayOffController.getMyDaysOff)
    this.router.patch(`${this.path}/confirm`,
      isAdminMiddleware, validationMiddleware(ConfirmDayOffDto, 'body'),
      this.dayOffController.confirmDayOff)
  }
}

export default DaysOffRoute;
