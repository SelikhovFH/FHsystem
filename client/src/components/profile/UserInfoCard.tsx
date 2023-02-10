import { FC } from "react";
import { User } from "../../shared/user.interface";
import { Avatar, Descriptions, Divider, theme, Typography } from "antd";
import { formatDate } from "../../utils/formatters";
import { UserRolesLabels, UserStatusLabels } from "../../sections/users";

const { Title, Text } = Typography;

type Props = {
  user: User
}

export const UserInfoCard: FC<Props> = ({ user }) => {
  const { token } = theme.useToken();
  const avatarText = user.name[0] + user.surname[0];
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
        <Avatar style={{ background: token.colorPrimary }} size={96}>
          <Text strong style={{ fontSize: 28, lineHeight: "96px", margin: 0, color: token.colorWhite }}>
            {avatarText}
          </Text>
        </Avatar>
        <Title style={{ marginBottom: 0, marginTop: 8 }} level={4}>
          {user.name}
          {" "}
          {user.surname}
        </Title>
        <Text type={"secondary"}>
          {user.email}
        </Text>
      </div>
      <Divider />
      <Descriptions size={"small"} column={1} title={"User info"}>
        <Descriptions.Item label="Role">{UserRolesLabels[user.role]}</Descriptions.Item>
        <Descriptions.Item label="Status">{UserStatusLabels[user.status]}</Descriptions.Item>
        <Descriptions.Item label="Title">{user.title}</Descriptions.Item>
        <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Emergency contact">{user.emergencyContact}</Descriptions.Item>
        <Descriptions.Item label="Work start date">{formatDate(user.workStartDate)}</Descriptions.Item>
        <Descriptions.Item label="Birth date">{formatDate(user.birthDate)}</Descriptions.Item>
        <Descriptions.Item label="Location">{user.location}</Descriptions.Item>
        <Descriptions.Item label="CV link"><a href={user.cvLink} target={"_blank"}>{user.cvLink}</a></Descriptions.Item>

      </Descriptions>
    </>
  );
};
