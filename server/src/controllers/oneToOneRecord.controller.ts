import { NextFunction, Request, Response } from "express";
import OneToOneRecordService from "@services/oneToOneRecord.service";
import { CreateOneToOneRecordDto, UpdateOneToOneRecordDto } from "@dtos/oneToOneRecord.dto";
import { GetTimeTrackDto } from "@dtos/timeTrack.dto";
import dayjs from "dayjs";

class OneToOneRecordController {
  private oneToOneRecordService = new OneToOneRecordService();

  createOneToOneRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectData: CreateOneToOneRecordDto = req.body;
      const data = await this.oneToOneRecordService.createOneToOneRecord(projectData);
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  updateOneToOneRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemData: UpdateOneToOneRecordDto = req.body;
      const data = await this.oneToOneRecordService.updateOneToOneRecord(itemData._id, itemData);
      res.status(200).json({ message: "OK", data });
    } catch (error) {
      next(error);
    }
  };

  deleteOneToOneRecord = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.oneToOneRecordService.deleteOneToOneRecord(id);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  getOneToOneRecordsFullYear = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query as unknown as GetTimeTrackDto;
      const records = await this.oneToOneRecordService.getOneToOneRecordsFullYear(dayjs(date));
      const _dates = records.map(record => new Date(record.date));
      const dates = this.oneToOneRecordService.getAggregatedDatesForOneToOne(_dates);
      const recordsByUser = this.oneToOneRecordService.groupOneToOneRecordsByUser(records);
      res.status(200).json({ message: "ok", data: { dates, records, recordsByUser } });
    } catch (error) {
      next(error);
    }
  };
}

export default OneToOneRecordController;
