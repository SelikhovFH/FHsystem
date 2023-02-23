export interface SkillTag {
  _id: string;
  name: string;
  color: SkillTagColor;
}

export enum SkillTagColor {
  default = "default",
  magenta = "magenta",
  red = "red",
  volcano = "volcano",
  orange = "orange",
  gold = "gold",
  lime = "lime",
  green = "green",
  cyan = "cyan",
  blue = "blue",
  geekblue = "geekblue",
  purple = "purple"
}
