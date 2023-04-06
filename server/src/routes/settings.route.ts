import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import { isAdminMiddleware } from "@middlewares/auth.middleware";
import { Container } from "typedi";
import SettingsController from "@/controllers/settings.controller";

class SettingsRoute implements Routes {
  public path = "/settings";
  public router = Router();
  public settingsController = Container.get(SettingsController);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:module`, this.settingsController.getSettings);
    this.router.patch(`${this.path}/:module`, isAdminMiddleware, this.settingsController.updateSettings);
  }
}

export default SettingsRoute;
