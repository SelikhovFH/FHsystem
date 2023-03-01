import { SkillTagCategory } from "../../shared/skillTag.interface";

export const SkillTagCategoryToColor: Record<SkillTagCategory, string> = {
  [SkillTagCategory.default]: "default",
  [SkillTagCategory.frontend]: "geekblue",
  [SkillTagCategory.backend]: "green",
  [SkillTagCategory.cloudServices]: "orange",
  [SkillTagCategory.mobile]: "blue",
  [SkillTagCategory.databases]: "red",
  [SkillTagCategory.devops]: "magenta",
  [SkillTagCategory.languageSkills]: "volcano",
  [SkillTagCategory.softSkills]: "lime"
  // gold:"gold"
  // cyan:"cyan",
  // purple:"purple"
};
