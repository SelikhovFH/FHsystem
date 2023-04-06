import { NextFunction, Request, Response } from "express";
import { Container, Service } from "typedi";
import { SettingsService } from "@services/settings.service";
import { SettingsModules } from "@interfaces/settings/settingsModules.enum";

@Service()
class SettingsController {
  private settingsService = Container.get(SettingsService);

  getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const module = req.params.module;
      const data = await this.settingsService.getSettings(module as SettingsModules);
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const module = req.params.module;
      const settings = req.body;
      await this.settingsService.validateSettings(module as SettingsModules, settings);
      const data = await this.settingsService.updateSettings(module as SettingsModules, settings);
      res.status(200).json({ message: "OK", data });
    } catch (error) {
      next(error);
    }
  };

}

export default SettingsController;
