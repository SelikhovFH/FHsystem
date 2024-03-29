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
    return this.project.find().populate("client").populate("manager", "_id name surname email").populate("workers.user", "_id name surname email");
  }

  public async getClientProjects(client: string): Promise<Project[]> {
    return this.project.find({ client }).populate("manager", "_id name surname email").populate("workers", "_id name surname email");
  }
}

export default ProjectService;
