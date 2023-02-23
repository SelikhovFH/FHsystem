import { Router } from "express";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@middlewares/validation.middleware";
import { isEditorMiddleware } from "@middlewares/auth.middleware";
import { DeleteDto } from "@dtos/common.dto";
import ProjectController from "@controllers/project.controller";
import { CreateProjectDto, UpdateProjectDto } from "@dtos/project.dto";

class ProjectsRoute implements Routes {
  public path = "/projects";
  public router = Router();
  public projectController = new ProjectController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.projectController.getProjects);
    this.router.post(`${this.path}`, isEditorMiddleware, validationMiddleware(CreateProjectDto, "body"), this.projectController.createProject);
    this.router.delete(`${this.path}/:id`, isEditorMiddleware, validationMiddleware(DeleteDto, "params"), this.projectController.deleteProject);
    this.router.patch(`${this.path}`, isEditorMiddleware, validationMiddleware(UpdateProjectDto, "body"), this.projectController.updateProject);
  }
}

export default ProjectsRoute;
