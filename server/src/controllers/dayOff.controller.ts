import { NextFunction, Request, Response } from "express";
import DayOffService from "@services/dayOff.service";
import { ConfirmDayOffDto, CreateDayOffDto } from "@dtos/dayOff.dto";
import Auth0Service from "@services/auth0.service";
import UserService from "@services/user.service";
import CalendarEventService from "@services/calendarEvent.service";

class DayOffController {
  private dayOffService = new DayOffService();
  private authOservice = new Auth0Service();
  private userService = new UserService();
  private calendarEventService = new CalendarEventService();

  createDayOff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const dayOffData: CreateDayOffDto = req.body;
      await this.dayOffService.validateDayOff(userId, dayOffData);
      const dayCount = this.dayOffService.calculateDayOffDayCount(dayOffData);
      const data = await this.dayOffService.createDayOff({ ...dayOffData, userId, dayCount });
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  getPendingDaysOff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pendingDaysOff = await this.dayOffService.getPendingDaysOff();
      const holidaysForCurrentYear = await this.calendarEventService.getHolidaysForCurrentYear();
      //I assume that we won't have too many concurrent pending days off, so code is  simple but not optimized here
      const promises = pendingDaysOff.map(async dayOff => {
        const dayOffExceedsLimit = await this.dayOffService.dayOffExceedsLimit(holidaysForCurrentYear, dayOff);
        return {
          ...dayOff,
          dayOffExceedsLimit
        };
      });
      const data = await Promise.all(promises);
      res.status(200).json({ data, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  confirmDayOff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const dayOffData: ConfirmDayOffDto = req.body;
      const data = await this.dayOffService.updateDayOff(dayOffData.id, {
        status: dayOffData.status,
        approvedById: userId
      });
      res.status(200).json({ data: data, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  getMyDaysOff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const myDaysOff = await this.dayOffService.getUserDaysOff(userId);
      res.status(200).json({ data: myDaysOff, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  getMyDaysOffUsage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const usage = await this.dayOffService.getUserDaysOffUsage(userId);
      res.status(200).json({ data: usage, message: "OK" });
    } catch (error) {
      next(error);
    }
  };
}

export default DayOffController;
