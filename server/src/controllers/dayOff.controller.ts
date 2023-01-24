import {NextFunction, Request, Response} from 'express';
import UserService from "@services/user.service";
import DayOffService from "@services/dayOff.service";
import {CreateDayOffDto} from "@dtos/dayOff.dto";

class DayOffController {
  private userService = new UserService()
  private dayOffService = new DayOffService()

  createDayOff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dayOffData: CreateDayOffDto = req.body;
      const data = await this.dayOffService.createDayOff(dayOffData)
      res.status(201).json({message: 'created', data});
    } catch (error) {
      next(error);
    }
  };

  getPendingDaysOff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pendingDaysOff = await this.dayOffService.getPendingDaysOff()
      res.status(200).json({data: pendingDaysOff, message: 'OK'});
    } catch (error) {
      next(error);
    }
  };

  getMyDaysOff = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth.payload
      console.debug(req.auth)
      // const pendingDaysOff = await this.dayOffService.getPendingDaysOff()
      res.status(200).json({data: [], message: 'OK'});
    } catch (error) {
      next(error);
    }
  };

}

export default DayOffController;
