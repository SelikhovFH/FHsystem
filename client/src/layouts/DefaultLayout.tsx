import { FC, useState } from "react";
import { Layout, Menu, MenuProps, theme, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminRoutes, AppRoutes, EditorRoutes } from "../router/AppRoutes";
import { useAuth0 } from "@auth0/auth0-react";
import { UserRole } from "../shared/user.interface";
import { LogoSvg } from "../components/svg/Logo";

const { Header, Content, Footer, Sider } = Layout;
const { Title } = Typography;
const { useToken } = theme;
type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Homepage", AppRoutes.index, <span>๐ </span>),
  getItem("Book day off", AppRoutes.bookDayOff, <span>๐</span>),
  getItem("Track time", AppRoutes.timeTrack, <span>โฑ๏ธ</span>),
  getItem("Profile", AppRoutes.profile, <span>๐ค</span>)
];

const editorItems = [
  getItem("Editor", "editor", null, [
    getItem("Confirm day off", EditorRoutes.confirmDayOff, <span>โ</span>),
    getItem("Time tracking overview", EditorRoutes.timeTrackOverview, <span>๐</span>),
    getItem("Manage one to one", EditorRoutes.manageOneToOne, <span>๐ฅ</span>),
    getItem("Holidays & celebrations", EditorRoutes.holidaysAndCelebrations, <span>๐</span>),
    getItem("Manage devices", EditorRoutes.manageDevices, <span>๐ป</span>),
    getItem("Manage items", EditorRoutes.manageItems, <span>๐ช</span>),
    getItem("Manage deliveries", EditorRoutes.manageDeliveries, <span>๐</span>),
    getItem("Manage clients", EditorRoutes.manageClients, <span>๐ผ</span>),
    getItem("Manage projects", EditorRoutes.manageProjects, <span>๐ง</span>),
    getItem("Manage skill tags", EditorRoutes.manageSkillTags, <span>๐คน</span>)

  ], "group")
];

const adminItems = [
  getItem("Admin", "admin", null, [
    getItem("Manage employees", AdminRoutes.manageUsers, <span>๐ฅ</span>)
  ], "group")
];

const getMenuItemsByRole = (role: UserRole) => {
  switch (role) {
    case UserRole.user:
      return items;
    case UserRole.editor:
      return items.concat(editorItems);
    case UserRole.admin:
      return items.concat(editorItems).concat(adminItems);
  }
};

type Props = {}

export const DefaultLayout: FC<Props> = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth0();
  const { token } = useToken();
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "8px 0"
        }}>
          <LogoSvg />
          {!collapsed && <Title style={{ margin: 16, color: token.colorWhite, whiteSpace: "nowrap" }}
                                level={3}>Trempel</Title>}
        </div>
        <Menu theme="dark" onSelect={e => {
          navigate(e.key);
        }}
              selectedKeys={[location.pathname]}
              defaultSelectedKeys={[location.pathname]} mode="inline"
              items={getMenuItemsByRole(user?.role)} />
      </Sider>
      <Layout>

        <Outlet />
      </Layout>
    </Layout>
  );
};
