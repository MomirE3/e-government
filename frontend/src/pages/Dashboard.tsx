import React from 'react';
import { Card, Row, Col, Typography, Space } from 'antd';
import {
	UserOutlined,
	FileTextOutlined,
	BarChartOutlined,
	RightOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth';

const { Title, Text } = Typography;

export const Dashboard: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();

	const quickActions = [
		{
			title: 'MUP Servisi',
			description: 'Pristupite MUP servisima i dokumentima',
			icon: <FileTextOutlined />,
			path: '/mup',
			available: true,
		},
		{
			title: 'Zavod za statistiku',
			description: 'Administracija anketa i izveštaja',
			icon: <BarChartOutlined />,
			path: '/zavod',
			available: user?.role === 'ADMIN',
		},
		{
			title: 'Moj profil',
			description: 'Upravljajte vašim profilom',
			icon: <UserOutlined />,
			path: '/profile',
			available: true,
		},
	];

	return (
		<div>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				{/* Welcome Section */}
				<Card>
					<Space direction='vertical' size='small'>
						<Title level={2} style={{ margin: 0 }}>
							Dobrodošli, {user?.firstName}!
						</Title>
						<Text type='secondary'>
							Pristupite e-Government servisima sa jednim nalogom
						</Text>
					</Space>
				</Card>

				{/* Statistics */}

				{/* Quick Actions */}
				<Card title='Brzi pristup'>
					<Row gutter={[16, 16]}>
						{quickActions.map((action) => (
							<Col xs={24} md={8} key={action.title}>
								<Card
									hoverable={action.available}
									style={{
										opacity: action.available ? 1 : 0.5,
										cursor: action.available ? 'pointer' : 'not-allowed',
									}}
									onClick={() => action.available && navigate(action.path)}
								>
									<Card.Meta
										avatar={action.icon}
										title={
											<Space>
												{action.title}
												{action.available && (
													<RightOutlined style={{ fontSize: '12px' }} />
												)}
											</Space>
										}
										description={action.description}
									/>
									{!action.available && (
										<Text type='secondary' style={{ fontSize: '12px' }}>
											Potrebne su admin dozvole
										</Text>
									)}
								</Card>
							</Col>
						))}
					</Row>
				</Card>

				{/* User Info */}
				<Card title='Informacije o nalogu'>
					<Row gutter={[16, 16]}>
						<Col xs={24} md={12}>
							<Space direction='vertical' size='small'>
								<div>
									<Text strong>Ime i prezime:</Text>
									<br />
									<Text>
										{user?.firstName} {user?.lastName}
									</Text>
								</div>
								<div>
									<Text strong>Email:</Text>
									<br />
									<Text>{user?.email}</Text>
								</div>
							</Space>
						</Col>
						<Col xs={24} md={12}>
							<Space direction='vertical' size='small'>
								<div>
									<Text strong>JMBG:</Text>
									<br />
									<Text>{user?.jmbg}</Text>
								</div>
								<div>
									<Text strong>Uloga:</Text>
									<br />
									<Text>
										{user?.role === 'ADMIN' ? 'Administrator' : 'Građanin'}
									</Text>
								</div>
							</Space>
						</Col>
					</Row>
				</Card>
			</Space>
		</div>
	);
};
