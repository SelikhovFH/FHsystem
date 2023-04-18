import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import { isEditorMiddleware } from '@middlewares/auth.middleware';
import BudgetController from '@/controllers/budget.controller';
import { GetBudgetMonthlyGeneral } from '@dtos/budget.dto';

class BudgetRoute implements Routes {
  public path = '/budget';
  public router = Router();
  public budgetController = new BudgetController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/monthly_general`,
      isEditorMiddleware,
      validationMiddleware(GetBudgetMonthlyGeneral, 'query'),
      this.budgetController.getMonthlyGeneral,
    );
  }
}

export default BudgetRoute;
