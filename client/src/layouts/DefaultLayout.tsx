import {FC, useState} from "react";
import {CheckSquareOutlined, CoffeeOutlined, HomeOutlined, UserAddOutlined, UserOutlined,} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Layout, Menu, theme, Typography} from 'antd';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {AdminRoutes, AppRoutes} from "../router/AppRoutes";
import {useAuth0} from "@auth0/auth0-react";

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
    getItem('Homepage', AppRoutes.index, <HomeOutlined/>),
    getItem('Book day off', AppRoutes.bookDayOff, <CoffeeOutlined/>),
    getItem('Profile', AppRoutes.profile, <UserOutlined/>),
];

const adminItems = [
    getItem('Admin', 'admin', null, [
        getItem('Manage users', AdminRoutes.manageUsers, <UserAddOutlined/>),
        getItem('Confirm day off', AdminRoutes.confirmDayOff, <CheckSquareOutlined/>)
    ], 'group'),
]

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
                    navigate(e.key)
                }}
                      defaultSelectedKeys={[location.pathname]} mode="inline"
                      items={user?.is_admin ? items.concat(adminItems) : items}/>
            </Sider>
            <Layout>

                <Outlet/>
            </Layout>
        </Layout>
    )
}
