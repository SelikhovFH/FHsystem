import { NextFunction, Request, Response } from "express";
import { CreateTimeTrackDto, GetTimeTrackDto, UpdateTimeTrackDto } from "@dtos/timeTrack.dto";
import TimeTrackService from "@services/timeTrack.service";
import UserService from "@services/user.service";
import { HttpException } from "@exceptions/HttpException";
import * as console from "console";


class TimeTrackController {
  private timeTrackService = new TimeTrackService();
  private userService = new UserService();

  createTimeTrack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const timeTrackData: CreateTimeTrackDto = req.body;
      await this.timeTrackService.validateTimeTrack(timeTrackData);
      const data = await this.timeTrackService.createTimeTrack({ ...timeTrackData, userId });
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  updateTimeTrack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const timeTrackData: UpdateTimeTrackDto = req.body;
      const prevTimeTrack = await this.timeTrackService.getTimeTrackById(timeTrackData._id);
      if (userId !== prevTimeTrack.userId.toString()) {
        throw new HttpException(400, "Can't update another user time track");
      }
      await this.timeTrackService.validateTimeTrack(timeTrackData);
      const data = await this.timeTrackService.updateTimeTrack(timeTrackData._id, timeTrackData);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  deleteTimeTrack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = req.auth.payload.db_id as string;
      const prevTimeTrack = await this.timeTrackService.getTimeTrackById(id);
      console.log("userId", userId);
      console.log("prevTimeTrack", prevTimeTrack);

      if (userId !== prevTimeTrack.userId.toString()) {
        throw new HttpException(400, "Can't delete another user time track");
      }
      const data = await this.timeTrackService.deleteTimeTrack(id);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  getMyTimeTracks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query as unknown as GetTimeTrackDto;
      const parsedDate = date ? new Date(date) : new Date();
      const userId = req.auth.payload.db_id as string;
      const data = await this.timeTrackService.getUserTimeTracks(userId, parsedDate);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  getTimeTracks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query as unknown as GetTimeTrackDto;
      const parsedDate = date ? new Date(date) : new Date();
      const timeTracks = await this.timeTrackService.getTimeTracks(parsedDate);
      const users = await this.userService.getUsersDisplayInfo();
      const workingDays = await this.timeTrackService.getWorkingDays(parsedDate);
      const usersWithNoTracks = users.filter(user => !timeTracks.find(track => track.userId === user._id));
      res.status(200).json({ message: "ok", data: { timeTracks, usersWithNoTracks, workingDays } });
    } catch (error) {
      next(error);
    }
  };

  getCreateTrackPrefill = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload.db_id as string;
      const currentMonth = new Date();
      const data = await this.timeTrackService.getCreateTrackPrefill(userId, currentMonth);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };


}

export default TimeTrackController;
