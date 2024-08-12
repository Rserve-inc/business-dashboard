// src/components/Sidebar.jsx
import React from 'react';
import { Layout, Menu } from 'antd';
const { Sider } = Layout;

const Sidebar = () => {
    return (
        <Sider width={200} className="site-layout-background">
            <Menu
                mode="inline"
                defaultSelectedKeys={['1']}
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item key="1">ダッシュボード</Menu.Item>
                <Menu.Item key="2">設定</Menu.Item>
            </Menu>
        </Sider>
    );
};

export default Sidebar;