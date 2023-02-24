import { NextFunction, Request, Response } from "express";
import SkillTagService from "@services/skillTag.service";
import { CreateSkillTagDto, UpdateSkillTagDto } from "@dtos/skillTag.dto";

class SkillTagController {
  private skillTagService = new SkillTagService();

  createSkillTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skillTagData: CreateSkillTagDto = req.body;
      const data = await this.skillTagService.createSkillTag(skillTagData);
      res.status(201).json({ message: "created", data });
    } catch (error) {
      next(error);
    }
  };

  updateSkillTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skillTagData: UpdateSkillTagDto = req.body;
      const data = await this.skillTagService.updateSkillTag(skillTagData._id, skillTagData);
      res.status(200).json({ message: "OK", data });
    } catch (error) {
      next(error);
    }
  };

  deleteSkillTag = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const data = await this.skillTagService.deleteSkillTag(id);
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };

  getSkillTags = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.skillTagService.getSkillTags();
      res.status(200).json({ message: "ok", data });
    } catch (error) {
      next(error);
    }
  };
}

export default SkillTagController;
