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
	QuestionCircleOutlined,
	TeamOutlined,
	DatabaseOutlined,
	EditOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
	surveyApi,
	type Survey,
	type Question,
	type Participant,
} from '../../api/survey.api';
import { CreateSurveyModal } from './CreateSurveyModal';
import { EditSurveyModal } from './EditSurveyModal';
import { AddQuestionsModal } from './AddQuestionsModal';
import { AddParticipantsModal } from './AddParticipantsModal';
import { CreateSampleModal } from './CreateSampleModal';
import { CreateReportModal } from './CreateReportModal';
import { ViewAnswersModal } from './ViewAnswersModal';

const { Title, Text } = Typography;

export const ZavodModule: React.FC = () => {
	const navigate = useNavigate();
	const [isCreateSurveyModalOpen, setIsCreateSurveyModalOpen] = useState(false);
	const [isEditSurveyModalOpen, setIsEditSurveyModalOpen] = useState(false);
	const [isAddQuestionsModalOpen, setIsAddQuestionsModalOpen] = useState(false);
	const [isAddParticipantsModalOpen, setIsAddParticipantsModalOpen] =
		useState(false);
	const [isCreateSampleModalOpen, setIsCreateSampleModalOpen] = useState(false);
	const [isCreateReportModalOpen, setIsCreateReportModalOpen] = useState(false);
	const [isViewAnswersModalOpen, setIsViewAnswersModalOpen] = useState(false);
	const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
	
	const queryClient = useQueryClient();

	// Fetch all surveys
	const {
		data: surveys = [],
		isLoading: isLoadingSurveys,
		refetch: refetchSurveys,
	} = useQuery<Survey[]>({
		queryKey: ['surveys'],
		queryFn: surveyApi.getAllSurveys,
	});

	// Update survey status mutation
	const updateStatusMutation = useMutation({
		mutationFn: ({ id, status }: { id: number; status: 'ACTIVE' | 'INACTIVE' }) =>
			surveyApi.updateSurveyStatus(id, status),
		onSuccess: () => {
			message.success('Status ankete je uspešno ažuriran!');
			queryClient.invalidateQueries({ queryKey: ['surveys'] });
		},
		onError: (error: unknown) => {
			console.error('Error updating survey status:', error);
			message.error(
				(error as { response?: { data?: { message: string } } }).response?.data
					?.message || 'Došlo je do greške prilikom ažuriranja statusa'
			);
		},
	});

	const handleCreateSurvey = () => {
		setIsCreateSurveyModalOpen(true);
	};

	const handleEditSurvey = (survey: Survey) => {
		setSelectedSurvey(survey);
		setIsEditSurveyModalOpen(true);
	};

	const handleModalClose = () => {
		setIsCreateSurveyModalOpen(false);
	};

	const handleEditModalClose = () => {
		setIsEditSurveyModalOpen(false);
		setSelectedSurvey(null);
	};

	const handleAddQuestions = (survey: Survey) => {
		setSelectedSurvey(survey);
		setIsAddQuestionsModalOpen(true);
	};

	const handleAddParticipants = (survey: Survey) => {
		setSelectedSurvey(survey);
		setIsAddParticipantsModalOpen(true);
	};

	const handleCreateSample = (survey: Survey) => {
		setSelectedSurvey(survey);
		setIsCreateSampleModalOpen(true);
	};

	const handleCreateReport = () => {
		setIsCreateReportModalOpen(true);
	};

	const handleViewAnswers = (survey: Survey) => {
		setSelectedSurvey(survey);
		setIsViewAnswersModalOpen(true);
	};

	const handleQuestionsModalClose = () => {
		setIsAddQuestionsModalOpen(false);
		setSelectedSurvey(null);
	};

	const handleParticipantsModalClose = () => {
		setIsAddParticipantsModalOpen(false);
		setSelectedSurvey(null);
	};

	const handleSampleModalClose = () => {
		setIsCreateSampleModalOpen(false);
		setSelectedSurvey(null);
	};

	const handleReportModalClose = () => {
		setIsCreateReportModalOpen(false);
	};

	const handleAnswersModalClose = () => {
		setIsViewAnswersModalOpen(false);
		setSelectedSurvey(null);
	};

	const handleSurveySuccess = () => {
		message.success('Anketa je uspešno kreirana!');
		refetchSurveys();
		handleModalClose();
	};

	const handleEditSuccess = () => {
		message.success('Anketa je uspešno ažurirana!');
		refetchSurveys();
		handleEditModalClose();
	};

	const handleQuestionsSuccess = () => {
		message.success('Pitanja su uspešno dodana!');
		refetchSurveys();
		handleQuestionsModalClose();
	};

	const handleParticipantsSuccess = () => {
		message.success('Učesnici su uspešno dodati!');
		refetchSurveys();
		handleParticipantsModalClose();
	};

	const handleSampleSuccess = () => {
		message.success('Uzorak je uspešno kreiran!');
		refetchSurveys();
		handleSampleModalClose();
	};

	const handleReportSuccess = () => {
		message.success('Izveštaj je uspešno kreiran!');
		handleReportModalClose();
	};

	const handleStatusToggle = (survey: Survey) => {
		const newStatus = survey.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
		updateStatusMutation.mutate({
			id: survey.id,
			status: newStatus,
		});
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
			render: (status: string, record: Survey) => (
				<Tag 
					color={status === 'ACTIVE' ? 'green' : 'orange'}
					style={{ 
						cursor: 'pointer',
						userSelect: 'none',
						transition: 'all 0.2s ease'
					}}
					onClick={() => handleStatusToggle(record)}
					title={`Kliknite da promenite status u ${status === 'ACTIVE' ? 'Neaktivna' : 'Aktivna'}`}
				>
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
			title: 'Period',
			dataIndex: 'period',
			key: 'period',
			render: (period: string) => (
				<Text>{period}</Text>
			),
		},
		{
			title: 'Akcije',
			key: 'actions',
			render: (record: Survey) => (
				<Space wrap>
					<Button
						type='primary'
						icon={<EditOutlined />}
						size='small'
						onClick={() => handleEditSurvey(record)}
					>
						Uredi
					</Button>
					<Button
						type='default'
						icon={<QuestionCircleOutlined />}
						size='small'
						onClick={() => handleAddQuestions(record)}
					>
						Pitanja
					</Button>
					<Button
						type='default'
						icon={<TeamOutlined />}
						size='small'
						onClick={() => handleAddParticipants(record)}
					>
						Učesnici
					</Button>
					<Button
						type='default'
						icon={<DatabaseOutlined />}
						size='small'
						onClick={() => handleCreateSample(record)}
					>
						Uzorak
					</Button>
					<Button
						type='default'
						icon={<EyeOutlined />}
						size='small'
						onClick={() => handleViewAnswers(record)}
					>
						Odgovori
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
						<Space>
							<Button
								type='default'
								icon={<BarChartOutlined />}
								onClick={() => navigate('/zavod/reports')}
							>
								Izveštaji
							</Button>
							<Button
								type='default'
								icon={<FileTextOutlined />}
								onClick={handleCreateReport}
							>
								Kreiraj izveštaj
							</Button>
							<Button
								type='primary'
								icon={<PlusOutlined />}
								onClick={handleCreateSurvey}
							>
								Kreiraj anketu
							</Button>
						</Space>
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
						scroll={{ x: 1200 }}
						size='small'
					/>
				</Card>

				{/* Create Survey Modal */}
				<CreateSurveyModal
					open={isCreateSurveyModalOpen}
					onClose={handleModalClose}
					onSuccess={handleSurveySuccess}
				/>

				{/* Edit Survey Modal */}
				<EditSurveyModal
					open={isEditSurveyModalOpen}
					onClose={handleEditModalClose}
					onSuccess={handleEditSuccess}
					survey={selectedSurvey}
				/>

				{/* Add Questions Modal */}
				<AddQuestionsModal
					open={isAddQuestionsModalOpen}
					onClose={handleQuestionsModalClose}
					survey={selectedSurvey}
					onSuccess={handleQuestionsSuccess}
				/>

				<AddParticipantsModal
					open={isAddParticipantsModalOpen}
					onClose={handleParticipantsModalClose}
					survey={selectedSurvey}
					onSuccess={handleParticipantsSuccess}
				/>

				<CreateSampleModal
					open={isCreateSampleModalOpen}
					onClose={handleSampleModalClose}
					survey={selectedSurvey}
					onSuccess={handleSampleSuccess}
				/>

				<CreateReportModal
					open={isCreateReportModalOpen}
					onClose={handleReportModalClose}
					onSuccess={handleReportSuccess}
				/>

				<ViewAnswersModal
					open={isViewAnswersModalOpen}
					onClose={handleAnswersModalClose}
					survey={selectedSurvey}
				/>
			</Space>
		</div>
	);
};
