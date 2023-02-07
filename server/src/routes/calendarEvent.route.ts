import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isEditorMiddleware } from "@middlewares/auth.middleware";
import CalendarEventController from "@controllers/calendarEvent.controller";
import { CreateCalendarEventDto, UpdateCalendarEventDto } from "@dtos/calendarEvent.dto";
import { DeleteDto } from "@dtos/common.dto";

class CalendarEventsRoute implements Routes {
  public path = "/calendar_events";
  public router = Router();
  public calendarEventController = new CalendarEventController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.calendarEventController.getCalendarEventsForCurrentYear);
    this.router.get(`${this.path}/holidays`, this.calendarEventController.getHolidaysForCurrentYear);
    this.router.post(
      `${this.path}`,
      isEditorMiddleware,
      validationMiddleware(CreateCalendarEventDto, "body"),
      this.calendarEventController.createCalendarEvent
    );
    this.router.delete(
      `${this.path}/:id`,
      isEditorMiddleware,
      validationMiddleware(DeleteDto, "params"),
      this.calendarEventController.deleteCalendarEvent
    );
    this.router.patch(
      `${this.path}`,
      isEditorMiddleware,
      validationMiddleware(UpdateCalendarEventDto, "body"),
      this.calendarEventController.updateCalendarEvent
    );
  }
}

export default CalendarEventsRoute;
