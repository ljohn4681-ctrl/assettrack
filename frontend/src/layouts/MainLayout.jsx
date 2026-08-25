import { Layout, Menu, Avatar, Dropdown, Typography } from "antd";
import {
  AppstoreOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";

import {
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const menuItems = [
    {
      key: "/",
      icon: <AppstoreOutlined />,
      label: "Dashboard",
    },
    {
      key: "/assets",
      icon: <DatabaseOutlined />,
      label: "Assets",
    },
    {
      key: "/reports",
      icon: <FileTextOutlined />,
      label: "Reports",
    },
  ];

  const userMenuItems = [
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Sign Out",
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleUserMenu = ({ key }) => {
    if (key === "logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");
    }
  };

  const getSelectedKey = () => {
    if (location.pathname.startsWith("/assets")) {
      return "/assets";
    }

    if (location.pathname.startsWith("/reports")) {
      return "/reports";
    }

    return "/";
  };

  return (
    <Layout className="app-layout">
      <Sider
        width={240}
        className="app-sidebar"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="sidebar-brand">
          <img
            src="/images/logo.png"
            alt="AssetTrack"
            className="sidebar-logo"
          />

          <div>
            <div className="sidebar-title">
              AssetTrack
            </div>

            <div className="sidebar-subtitle">
              Inventory System
            </div>
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={handleMenuClick}
          className="sidebar-menu"
        />
      </Sider>

      <Layout>
        <Header className="app-header">
          <div />

          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenu,
            }}
            trigger={["click"]}
          >
            <div className="user-profile">
              <Avatar
                icon={<UserOutlined />}
                className="user-avatar"
              />

              <div className="user-info">
                <Text strong>
                  {user.fullName || "Administrator"}
                </Text>

                <span>
                  {user.role || "Admin"}
                </span>
              </div>
            </div>
          </Dropdown>
        </Header>

        <Content className="app-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;