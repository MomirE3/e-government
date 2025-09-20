import React, { useState } from 'react';
import {
	Card,
	Button,
	Space,
	Typography,
	Row,
	Col,
	Table,
	Tag,
	message,
} from 'antd';
import {
	UserOutlined,
	FileTextOutlined,
	ExclamationCircleOutlined,
	FileSearchOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { citizenApi, type Citizen } from '../../api/citizen.api';
import { AddInfractionModal } from './AddInfractionModal';

const { Title, Text } = Typography;

export const MupModule: React.FC = () => {
	const [isAddInfractionModalOpen, setIsAddInfractionModalOpen] =
		useState(false);
	const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
	const navigate = useNavigate();

	// Fetch all citizens for admin (excluding admins)
	const { data: allCitizens = [], isLoading: isLoadingCitizens } = useQuery({
		queryKey: ['citizens'],
		queryFn: citizenApi.getAllCitizens,
	});

	// Filter out admins - only show citizens
	const citizens = allCitizens.filter(
		(citizen: Citizen) => citizen.role === 'CITIZEN'
	);

	const handleAddInfraction = (citizen: Citizen) => {
		setSelectedCitizen(citizen);
		setIsAddInfractionModalOpen(true);
	};

	const handleModalClose = () => {
		setIsAddInfractionModalOpen(false);
		setSelectedCitizen(null);
	};

	const columns = [
		{
			title: 'Ime i prezime',
			key: 'name',
			render: (record: Citizen) => (
				<Space>
					<UserOutlined />
					<Text strong>
						{record.firstName} {record.lastName}
					</Text>
				</Space>
			),
		},
		{
			title: 'JMBG',
			dataIndex: 'jmbg',
			key: 'jmbg',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Telefon',
			dataIndex: 'phone',
			key: 'phone',
		},
		{
			title: 'Uloga',
			dataIndex: 'role',
			key: 'role',
			render: (role: string) => (
				<Tag color={role === 'ADMIN' ? 'red' : 'blue'}>
					{role === 'ADMIN' ? 'Administrator' : 'Građanin'}
				</Tag>
			),
		},
		{
			title: 'Akcije',
			key: 'actions',
			render: (record: Citizen) => (
				<Space>
					<Button
						type='primary'
						icon={<ExclamationCircleOutlined />}
						size='small'
						onClick={() => handleAddInfraction(record)}
					>
						Dodaj prekršaj
					</Button>
				</Space>
			),
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<div>
					<Space
						align='center'
						style={{ width: '100%', justifyContent: 'space-between' }}
					>
						<div>
							<Title level={2}>MUP Servisi</Title>
							<Text type='secondary'>Upravljanje građanima i prekršajima</Text>
						</div>
						<Button
							type='primary'
							icon={<FileSearchOutlined />}
							size='large'
							onClick={() => navigate('/mup/requests')}
						>
							Zahtevi
						</Button>
					</Space>
				</div>

				{/* Statistics Cards */}
				<Row gutter={16}>
					<Col span={8}>
						<Card>
							<Space
								direction='vertical'
								size='small'
								style={{ width: '100%' }}
							>
								<Text type='secondary'>Ukupno građana</Text>
								<Title level={3} style={{ margin: 0 }}>
									{citizens.length}
								</Title>
							</Space>
						</Card>
					</Col>
				</Row>

				{/* Citizens Table */}
				<Card
					title={
						<Space>
							<FileTextOutlined />
							<Text strong>Lista građana</Text>
						</Space>
					}
				>
					<Table
						columns={columns}
						dataSource={citizens}
						rowKey='id'
						loading={isLoadingCitizens}
						pagination={{
							pageSize: 10,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} od ${total} građana`,
						}}
						scroll={{ x: 800 }}
					/>
				</Card>

				{/* Add Infraction Modal */}
				<AddInfractionModal
					open={isAddInfractionModalOpen}
					onClose={handleModalClose}
					citizen={selectedCitizen}
					onSuccess={() => {
						message.success('Prekršaj je uspešno dodat!');
						handleModalClose();
					}}
				/>
			</Space>
		</div>
	);
};
