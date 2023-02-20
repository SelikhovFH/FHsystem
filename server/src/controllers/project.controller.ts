import { NextFunction, Request, Response } from "express";
import ProjectService from "@services/project.service";
import { CreateProjectDto, UpdateProjectDto } from "@dtos/project.dto";

class ProjectController {
  private projectService = new ProjectService();

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectData: CreateProjectDto = req.body;
      const data = await this.projectService.createProject(projectData);
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemData: UpdateProjectDto = req.body;
      const data = await this.projectService.updateProject(itemData._id, itemData);
      res.status(200).json({ message: "OK", data });
    } catch (error) {
      next(error);
    }
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.projectService.deleteProject(id);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  getProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.projectService.getProjects();
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };
}

export default ProjectController;
