import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isEditorMiddleware } from "@middlewares/auth.middleware";
import { DeleteDto } from "@dtos/common.dto";
import TimeTrackController from "@controllers/timeTrack.controller";
import { CreateTimeTrackDto, GetTimeTrackDto, GetUserTracksDto, UpdateTimeTrackDto } from "@dtos/timeTrack.dto";

class ItemsRoute implements Routes {
  public path = "/time_tracks";
  public router = Router();
  public timeTrackController = new TimeTrackController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/my`, validationMiddleware(GetTimeTrackDto, "query"), this.timeTrackController.getMyTimeTracks);
    this.router.post(`${this.path}/my`, validationMiddleware(CreateTimeTrackDto, "body"), this.timeTrackController.createTimeTrack);
    this.router.delete(`${this.path}/my/:id`, validationMiddleware(DeleteDto, "params"), this.timeTrackController.deleteTimeTrack);
    this.router.patch(`${this.path}/my`, validationMiddleware(UpdateTimeTrackDto, "body"), this.timeTrackController.updateTimeTrack);
    this.router.get(`${this.path}/my/prefill`, this.timeTrackController.getCreateTrackPrefill);
    this.router.get(`${this.path}`, isEditorMiddleware, validationMiddleware(GetTimeTrackDto, "query"), this.timeTrackController.getTimeTracks);
    this.router.get(`${this.path}/:userId`, isEditorMiddleware, validationMiddleware(GetUserTracksDto, "params"), validationMiddleware(GetTimeTrackDto, "query"), this.timeTrackController.getUserTimeTracks);

  }
}

export default ItemsRoute;
