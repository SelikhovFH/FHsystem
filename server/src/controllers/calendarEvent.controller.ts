import { NextFunction, Request, Response } from "express";
import CalendarEventService from "@services/calendarEvent.service";
import { CreateCalendarEventDto, UpdateCalendarEventDto } from "@dtos/calendarEvent.dto";

class CalendarEventController {
  private calendarEventService = new CalendarEventService();

  createCalendarEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const calendarEventData: CreateCalendarEventDto = req.body;
      const data = await this.calendarEventService.createCalendarEvent({ ...calendarEventData, createdBy: userId });
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  updateCalendarEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const calendarEventData: UpdateCalendarEventDto = req.body;
      const data = await this.calendarEventService.updateCalendarEvent(calendarEventData._id, calendarEventData);
      res.status(200).json({ message: "OK", data });
    } catch (error) {
      next(error);
    }
  };

  deleteCalendarEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.calendarEventService.deleteCalendarEvent(id);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  getCalendarEventsForCurrentYear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.calendarEventService.getCalendarEventsForCurrentYear();
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  getHolidaysForCurrentYear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.calendarEventService.getHolidaysForCurrentYear();
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };
}

export default CalendarEventController;
