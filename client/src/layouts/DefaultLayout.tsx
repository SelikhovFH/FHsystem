import {FC, useState} from "react";
import {
    CheckSquareOutlined,
    CoffeeOutlined,
    DesktopOutlined,
    FileOutlined, HomeOutlined,
    PieChartOutlined,
    TeamOutlined, UserAddOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Breadcrumb, Layout, Menu, theme, Typography} from 'antd';
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {AdminRoutes, AppRoutes} from "../router/AppRoutes";

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

const removePathnameSlash = (str:string)=> str.replace(/^\/|\/$/g, '')

export const DefaultLayout: FC<Props> = (props) => {
    const [collapsed, setCollapsed] = useState(false);
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
                      defaultSelectedKeys={[removePathnameSlash(location.pathname)]} mode="inline"
                      items={items.concat(adminItems)}/>
            </Sider>
            <Layout className="site-layout">
                <Content style={{margin: '0 16px'}}>
                    <Outlet/>
                </Content>
            </Layout>
        </Layout>
    )
}
