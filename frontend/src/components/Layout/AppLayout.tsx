import React, { useState } from 'react';
import {
	Layout,
	Menu,
	Button,
	Avatar,
	Dropdown,
	Space,
	Typography,
} from 'antd';
import {
	MenuFoldOutlined,
	MenuUnfoldOutlined,
	DashboardOutlined,
	UserOutlined,
	LogoutOutlined,
	SettingOutlined,
	FileTextOutlined,
	BarChartOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useLogoutMutation } from '../../features/auth';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface AppLayoutProps {
	children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false);
	const { user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const logoutMutation = useLogoutMutation();

	const handleLogout = async () => {
		try {
			await logoutMutation.mutateAsync();
			navigate('/auth/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	const menuItems: MenuProps['items'] = [
		{
			key: '/dashboard',
			icon: <DashboardOutlined />,
			label: 'Dashboard',
			onClick: () => navigate('/dashboard'),
		},
		{
			key: '/mup',
			icon: <FileTextOutlined />,
			label: 'MUP Servisi',
			onClick: () => navigate('/mup'),
		},
		...(user?.role === 'ADMIN'
			? [
					{
						key: '/zavod',
						icon: <BarChartOutlined />,
						label: 'Zavod za statistiku',
						onClick: () => navigate('/zavod'),
					},
			  ]
			: []),
		{
			key: '/profile',
			icon: <UserOutlined />,
			label: 'Profil',
			onClick: () => navigate('/profile'),
		},
	];

	const userMenuItems: MenuProps['items'] = [
		{
			key: 'profile',
			icon: <UserOutlined />,
			label: 'Moj profil',
			onClick: () => navigate('/profile'),
		},
		{
			key: 'settings',
			icon: <SettingOutlined />,
			label: 'Podešavanja',
			disabled: true,
		},
		{
			type: 'divider',
		},
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: 'Odjavi se',
			onClick: handleLogout,
		},
	];

	const selectedKey = '/' + location.pathname.split('/')[1];

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Sider
				trigger={null}
				collapsible
				collapsed={collapsed}
				theme='dark'
				style={{
					background: 'linear-gradient(180deg, #001529 0%, #002140 100%)',
				}}
			>
				<div
					style={{
						height: 64,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						color: 'white',
						fontSize: collapsed ? '16px' : '18px',
						fontWeight: 'bold',
						borderBottom: '1px solid #002140',
					}}
				>
					{collapsed ? 'eGov' : 'e-Government'}
				</div>

				<Menu
					theme='dark'
					mode='inline'
					selectedKeys={[selectedKey]}
					items={menuItems}
					style={{
						background: 'transparent',
						border: 'none',
					}}
				/>
			</Sider>

			<Layout>
				<Header
					style={{
						padding: '0 24px',
						background: '#fff',
						borderBottom: '1px solid #f0f0f0',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Button
						type='text'
						icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
						onClick={() => setCollapsed(!collapsed)}
						style={{ fontSize: '16px', width: 64, height: 64 }}
					/>

					<Dropdown menu={{ items: userMenuItems }} placement='bottomRight'>
						<Space style={{ cursor: 'pointer' }}>
							<Avatar icon={<UserOutlined />} />
							<Space direction='vertical' size={0}>
								<Text strong>
									{user?.firstName} {user?.lastName}
								</Text>
								<Text type='secondary' style={{ fontSize: '12px' }}>
									{user?.role === 'ADMIN' ? 'Administrator' : 'Građanin'}
								</Text>
							</Space>
						</Space>
					</Dropdown>
				</Header>

				<Content
					style={{
						padding: '24px',
						background: '#f5f5f5',
						overflow: 'auto',
					}}
				>
					{children}
				</Content>
			</Layout>
		</Layout>
	);
};
