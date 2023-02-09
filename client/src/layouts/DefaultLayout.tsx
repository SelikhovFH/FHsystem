import { FC, useState } from "react";
import type { MenuProps } from "antd";
import { Layout, Menu, theme, Typography } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AdminRoutes, AppRoutes, EditorRoutes } from "../router/AppRoutes";
import { useAuth0 } from "@auth0/auth0-react";
import { UserRole } from "../shared/user.interface";

const {Header, Content, Footer, Sider} = Layout;
const {Title} = Typography;
const {useToken} = theme;
type MenuItem = Required<MenuProps>['items'][number];

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
    getItem('🏠 Homepage', AppRoutes.index,),
    getItem('📅 Book day off', AppRoutes.bookDayOff),
    getItem('👤 Profile', AppRoutes.profile,),
];

const editorItems = [
    getItem('Editor', 'editor', null, [
        getItem('✅ Confirm day off', EditorRoutes.confirmDayOff),
        getItem('🎉 Holidays & celebrations', EditorRoutes.holidaysAndCelebrations),
        getItem('💻 Manage devices', EditorRoutes.manageDevices),
        getItem('🪑 Manage items', EditorRoutes.manageItems),
        getItem('🚚 Manage deliveries', EditorRoutes.manageDeliveries)
    ], 'group'),
]

const adminItems = [
    getItem('Admin', 'admin', null, [
        getItem('👥 Manage users', AdminRoutes.manageUsers,),
    ], 'group'),
]

const getMenuItemsByRole = (role: UserRole) => {
    switch (role) {
        case UserRole.user:
            return items
        case UserRole.editor:
            return items.concat(editorItems)
        case UserRole.admin:
            return items.concat(editorItems).concat(adminItems)
    }
}

type Props = {}

export const DefaultLayout: FC<Props> = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const {user} = useAuth0()
    const {token} = useToken();
    const navigate = useNavigate()
    const location = useLocation()
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <Title style={{margin: 16, color: token.colorWhite}} level={3}>{collapsed ? "FH" : "FHSystem"}</Title>
                <Menu theme="dark" onSelect={e => {
                    navigate(e.key);
                }}
                      selectedKeys={[location.pathname]}
                      defaultSelectedKeys={[location.pathname]} mode="inline"
                      items={getMenuItemsByRole(user?.role)}/>
            </Sider>
            <Layout>

                <Outlet/>
            </Layout>
        </Layout>
    )
}
