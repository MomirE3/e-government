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
	Statistic,
} from 'antd';
import {
	PlusOutlined,
	BarChartOutlined,
	FileTextOutlined,
	UserOutlined,
	EyeOutlined,
	EditOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import {
	surveyApi,
	type Survey,
	type Question,
	type Participant,
} from '../../api/survey.api';
import { CreateSurveyModal } from './CreateSurveyModal';

const { Title, Text } = Typography;

export const ZavodModule: React.FC = () => {
	const [isCreateSurveyModalOpen, setIsCreateSurveyModalOpen] = useState(false);

	// Fetch all surveys
	const {
		data: surveys = [],
		isLoading: isLoadingSurveys,
		refetch: refetchSurveys,
	} = useQuery<Survey[]>({
		queryKey: ['surveys'],
		queryFn: surveyApi.getAllSurveys,
	});

	const handleCreateSurvey = () => {
		setIsCreateSurveyModalOpen(true);
	};

	const handleModalClose = () => {
		setIsCreateSurveyModalOpen(false);
	};

	const handleSurveySuccess = () => {
		message.success('Anketa je uspešno kreirana!');
		refetchSurveys();
		handleModalClose();
	};

	const columns = [
		{
			title: 'Naziv ankete',
			key: 'title',
			render: (record: Survey) => (
				<Space>
					<FileTextOutlined />
					<Text strong>{record.title}</Text>
				</Space>
			),
		},
		{
			title: 'Opis',
			dataIndex: 'description',
			key: 'description',
			render: (description: string) => (
				<Text ellipsis={{ tooltip: description }} style={{ maxWidth: 200 }}>
					{description}
				</Text>
			),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (status: string) => (
				<Tag color={status === 'ACTIVE' ? 'green' : 'orange'}>
					{status === 'ACTIVE' ? 'Aktivna' : 'Neaktivna'}
				</Tag>
			),
		},
		{
			title: 'Broj pitanja',
			dataIndex: 'questions',
			key: 'questions',
			render: (questions: Question[]) => <Text>{questions?.length || 0}</Text>,
		},
		{
			title: 'Broj učesnika',
			dataIndex: 'participants',
			key: 'participants',
			render: (participants: Participant[]) => (
				<Text>{participants?.length || 0}</Text>
			),
		},
		{
			title: 'Datum kreiranja',
			dataIndex: 'createdAt',
			key: 'createdAt',
			render: (date: string) => (
				<Text>{new Date(date).toLocaleDateString('sr-RS')}</Text>
			),
		},
		{
			title: 'Akcije',
			key: 'actions',
			render: () => (
				<Space>
					<Button
						type='default'
						icon={<EyeOutlined />}
						size='small'
						onClick={() => {
							message.info('Pregled ankete će biti dostupan uskoro');
						}}
					>
						Pregled
					</Button>
					<Button
						type='primary'
						icon={<EditOutlined />}
						size='small'
						onClick={() => {
							message.info('Uređivanje ankete će biti dostupno uskoro');
						}}
					>
						Uredi
					</Button>
				</Space>
			),
		},
	];

	// Calculate statistics
	const totalSurveys = surveys.length;
	const activeSurveys = surveys.filter(
		(s: Survey) => s.status === 'ACTIVE'
	).length;
	const totalQuestions = surveys.reduce(
		(sum: number, s: Survey) => sum + (s.questions?.length || 0),
		0
	);
	const totalParticipants = surveys.reduce(
		(sum: number, s: Survey) => sum + (s.participants?.length || 0),
		0
	);

	return (
		<div style={{ padding: '24px' }}>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<div>
					<Title level={2}>Zavod za statistiku</Title>
					<Text type='secondary'>
						Upravljanje anketama i statističkim istraživanjima
					</Text>
				</div>

				{/* Statistics Cards */}
				<Row gutter={16}>
					<Col span={6}>
						<Card>
							<Statistic
								title='Ukupno anketa'
								value={totalSurveys}
								prefix={<FileTextOutlined />}
							/>
						</Card>
					</Col>
					<Col span={6}>
						<Card>
							<Statistic
								title='Aktivne ankete'
								value={activeSurveys}
								prefix={<BarChartOutlined />}
								valueStyle={{ color: '#3f8600' }}
							/>
						</Card>
					</Col>
					<Col span={6}>
						<Card>
							<Statistic
								title='Ukupno pitanja'
								value={totalQuestions}
								prefix={<FileTextOutlined />}
							/>
						</Card>
					</Col>
					<Col span={6}>
						<Card>
							<Statistic
								title='Ukupno učesnika'
								value={totalParticipants}
								prefix={<UserOutlined />}
							/>
						</Card>
					</Col>
				</Row>

				{/* Surveys Table */}
				<Card
					title={
						<Space>
							<BarChartOutlined />
							<Text strong>Lista anketa</Text>
						</Space>
					}
					extra={
						<Button
							type='primary'
							icon={<PlusOutlined />}
							onClick={handleCreateSurvey}
						>
							Kreiraj anketu
						</Button>
					}
				>
					<Table
						columns={columns}
						dataSource={surveys}
						rowKey='id'
						loading={isLoadingSurveys}
						pagination={{
							pageSize: 10,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} od ${total} anketa`,
						}}
						scroll={{ x: 1000 }}
					/>
				</Card>

				{/* Create Survey Modal */}
				<CreateSurveyModal
					open={isCreateSurveyModalOpen}
					onClose={handleModalClose}
					onSuccess={handleSurveySuccess}
				/>
			</Space>
		</div>
	);
};
