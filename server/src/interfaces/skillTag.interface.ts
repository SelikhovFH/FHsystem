export interface SkillTag {
  _id: string;
  name: string;
  category: SkillTagCategory;
}

export enum SkillTagCategory {
  default = "default",
  frontend = "frontend",
  backend = "backend",
  cloudServices = "cloudServices",
  mobile = "mobile",
  databases = "databases",
  devops = "devops",
  languageSkills = "languageSkills",
  softSkills = "softSkills"

}
