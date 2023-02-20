import projectModel from "@models/project.model";
import { CreateProjectDto, UpdateProjectDto } from "@dtos/project.dto";
import { Project } from "@interfaces/project.interface";

class ProjectService {
  private project = projectModel;

  public async createProject(data: CreateProjectDto): Promise<Project> {
    return this.project.create(data);
  }

  public async updateProject(_id: string, data: Partial<UpdateProjectDto>): Promise<Project> {
    return this.project.findOneAndUpdate({ _id }, data);
  }

  public async deleteProject(_id: string) {
    return this.project.findOneAndDelete({ _id });
  }

  public async getProjectById(_id: string) {
    return this.project.findOne({ _id });
  }

  public async getProjects(): Promise<Project[]> {
    return this.project.find();
  }
}

export default ProjectService;
