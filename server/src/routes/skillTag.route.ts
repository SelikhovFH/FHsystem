import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isEditorMiddleware } from "@middlewares/auth.middleware";
import { DeleteDto } from "@dtos/common.dto";
import SkillTagController from "@controllers/skillTag.controller";
import { CreateSkillTagDto, UpdateSkillTagDto } from "@dtos/skillTag.dto";

class ProjectsRoute implements Routes {
  public path = "/skill_tags";
  public router = Router();
  public skillTagController = new SkillTagController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.skillTagController.getSkillTags);
    this.router.post(`${this.path}`, isEditorMiddleware, validationMiddleware(CreateSkillTagDto, "body"), this.skillTagController.createSkillTag);
    this.router.delete(`${this.path}/:id`, isEditorMiddleware, validationMiddleware(DeleteDto, "params"), this.skillTagController.deleteSkillTag);
    this.router.patch(`${this.path}`, isEditorMiddleware, validationMiddleware(UpdateSkillTagDto, "body"), this.skillTagController.updateSkillTag);
  }
}

export default ProjectsRoute;
