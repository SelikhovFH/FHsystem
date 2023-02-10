import { UserRole, UserStatus } from "../../shared/user.interface";


export const UserRolesLabels: Record<UserRole, string> = {
  [UserRole.user]: "👤 User",
  [UserRole.editor]: "✏️ Editor",
  [UserRole.admin]: "👑 Admin"
};

export const UserStatusLabels: Record<UserStatus, string> = {
  [UserStatus.working]: "🛠️ Working",
  [UserStatus.bench]: "🪑 Bench",
  [UserStatus.training]: "📚 Training"
};

