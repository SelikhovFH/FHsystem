import skillTagModel from "@models/skillTag.model";
import { CreateSkillTagDto, UpdateSkillTagDto } from "@dtos/skillTag.dto";
import { SkillTag } from "@interfaces/skillTag.interface";

class SkillTagService {
  private skillTag = skillTagModel;

  public async createSkillTag(data: CreateSkillTagDto): Promise<SkillTag> {
    return this.skillTag.create(data);
  }

  public async updateSkillTag(_id: string, data: Partial<UpdateSkillTagDto>): Promise<SkillTag> {
    return this.skillTag.findOneAndUpdate({ _id }, data);
  }

  public async deleteSkillTag(_id: string) {
    return this.skillTag.findOneAndDelete({ _id });
  }

  public async getSkillTagById(_id: string) {
    return this.skillTag.findOne({ _id });
  }

  public async getSkillTags(): Promise<SkillTag[]> {
    return this.skillTag.find().sort({ color: "desc" }).exec();
  }
}

export default SkillTagService;
