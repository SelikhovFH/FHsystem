import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { BudgetService } from '@services/budget.service';

class BudgetController {
  private budgetService = Container.get(BudgetService);

  getMonthlyGeneral = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query;
      const data = await this.budgetService.getMonthlyGeneral(new Date(date as string));
      res.status(201).json({ message: 'created', data });
    } catch (error) {
      next(error);
    }
  };
}

export default BudgetController;
