import { NextFunction, Request, Response } from "express";
import DayOffService from "@services/dayOff.service";
import { ConfirmDayOffDto, CreateDayOffDto, CreateDayOffEditorDto, UpdateDayOffEditorDto } from "@dtos/dayOff.dto";
import Auth0Service from "@services/auth0.service";
import UserService from "@services/user.service";
import CalendarEventService from "@services/calendarEvent.service";
import { HttpException } from "@exceptions/HttpException";
import { NotificationsDispatcher } from "@/services/notifications/notifications.dispatcher";
import { Container } from "typedi";
import { NotificationType } from "@interfaces/notification.interface";
import { formatDate, getDisplayName } from "@utils/formatters";

class DayOffController {
  private dayOffService = new DayOffService();
  private authOservice = new Auth0Service();
  private userService = new UserService();
  private calendarEventService = new CalendarEventService();
  private notificationDispatcher = Container.get(NotificationsDispatcher);

  createDayOffMy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const dayOffData: CreateDayOffDto = req.body;
      await this.dayOffService.validateDayOff(userId, dayOffData);
      const dayCount = this.dayOffService.calculateDayOffDayCount(dayOffData);
      const data = await this.dayOffService.createDayOff({ ...dayOffData, userId, dayCount });
      const user = await this.userService.getUserById(userId);
      this.notificationDispatcher.dispatchMultipleNotifications({
        type: NotificationType.info,
        title: "New day off request",
        description: `You have a new day off request from for ${getDisplayName(user)} date ${formatDate(dayOffData.startDate)} to ${formatDate(dayOffData.finishDate)}`,
        link: "/confirm_day_off",
        event: "day_off_created"
      }, await this.notificationDispatcher.getEditorIds());
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  getDayOffs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.dayOffService.getDayOffs();
      res.status(200).json({ data, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  updateDayOff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id;
      const dayOffData: UpdateDayOffEditorDto = req.body;
      if (dayOffData.userId === userId) {
        throw new HttpException(400, "You can't update your day off via this method");
      }
      const data = await this.dayOffService.updateDayOff(dayOffData._id, dayOffData);
      res.status(200).json({ data: data, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  deleteDayOff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id;
      const dayOffData = await this.dayOffService.getDayOffById(req.params.id);
      if (dayOffData.userId.toString() === userId) {
        throw new HttpException(400, "You can't delete your day off via this method");
      }
      const data = await this.dayOffService.deleteDayOff(req.params.id);
      res.status(200).json({ data: data, message: "OK" });
    } catch (error) {
      next(error);
    }
  };

  createDayOff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id;
      const dayOffData: CreateDayOffEditorDto = req.body;
      if (dayOffData.userId === userId) {
        throw new HttpException(400, "You can't create day off for yourself via this method");
      }
      const data = await this.dayOffService.createDayOff({
        ...dayOffData,
        dayCount: this.dayOffService.calculateDayOffDayCount(dayOffData)
      });
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
      const dayOff = await this.dayOffService.getDayOffById(dayOffData.id);

      if (dayOff.userId.toString() === userId) {
        throw new HttpException(400, "You can't confirm your day off via this method");
      }
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
