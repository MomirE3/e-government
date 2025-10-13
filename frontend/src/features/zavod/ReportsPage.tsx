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
	Modal,
	Descriptions,
	Divider,
	Empty,
	Spin,
} from 'antd';
import {
	PlusOutlined,
	BarChartOutlined,
	FileTextOutlined,
	EyeOutlined,
	CalendarOutlined,
	DatabaseOutlined,
	UserOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { surveyApi, type Report, type SurveyStatistics } from '../../api/survey.api';
import { CreateReportModal } from './CreateReportModal';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export const ReportsPage: React.FC = () => {
	const navigate = useNavigate();
	const [isCreateReportModalOpen, setIsCreateReportModalOpen] = useState(false);
	const [selectedReport, setSelectedReport] = useState<Report | null>(null);
	const [isViewModalOpen, setIsViewModalOpen] = useState(false);
	const [surveyStatistics, setSurveyStatistics] = useState<SurveyStatistics | null>(null);

	// Fetch all reports
	const {
		data: reports = [],
		isLoading: isLoadingReports,
		refetch: refetchReports,
	} = useQuery<Report[]>({
		queryKey: ['reports'],
		queryFn: surveyApi.getAllReports,
	});

	const handleCreateReport = () => {
		setIsCreateReportModalOpen(true);
	};

	const handleViewReport = async (report: Report) => {
		setSelectedReport(report);
		setIsViewModalOpen(true);
		
		// Ako je anketa izveštaj, učitaj statistike
		if (report.type === 'SURVEY' && report.surveyId) {
			try {
				const stats = await surveyApi.getSurveyStatistics(report.surveyId);
				setSurveyStatistics(stats);
			} catch (error) {
				console.error('Error loading survey statistics:', error);
				setSurveyStatistics(null);
			}
		} else {
			setSurveyStatistics(null);
		}
	};

	const handleModalClose = () => {
		setIsCreateReportModalOpen(false);
	};

	const handleViewModalClose = () => {
		setIsViewModalOpen(false);
		setSelectedReport(null);
		setSurveyStatistics(null);
	};

	const handleReportSuccess = () => {
		message.success('Izveštaj je uspešno kreiran!');
		refetchReports();
		handleModalClose();
	};

	const getReportTypeColor = (type: string) => {
		switch (type) {
			case 'DUI':
				return 'red';
			case 'DOCS_ISSUED':
				return 'blue';
			case 'SURVEY':
				return 'green';
			default:
				return 'default';
		}
	};

	const getReportTypeLabel = (type: string) => {
		switch (type) {
			case 'DUI':
				return 'DUI izveštaj';
			case 'DOCS_ISSUED':
				return 'Izveštaj o dokumentima';
			case 'SURVEY':
				return 'Anketa izveštaj';
			default:
				return type;
		}
	};

	const columns = [
		{
			title: 'Naziv izveštaja',
			key: 'title',
			render: (record: Report) => (
				<Space>
					<FileTextOutlined />
					<Text strong>{record.title}</Text>
				</Space>
			),
		},
		{
			title: 'Tip',
			dataIndex: 'type',
			key: 'type',
			render: (type: string) => (
				<Tag color={getReportTypeColor(type)}>
					{getReportTypeLabel(type)}
				</Tag>
			),
		},
		{
			title: 'Datum kreiranja',
			dataIndex: 'generatedAt',
			key: 'generatedAt',
			render: (date: string) => (
				<Space>
					<CalendarOutlined />
					<Text>{dayjs(date).format('DD.MM.YYYY HH:mm')}</Text>
				</Space>
			),
		},
		{
			title: 'Broj DUI slučajeva',
			key: 'duiCount',
			render: (record: Report) => (
				<Text>{record.duiIndicators?.length || 0}</Text>
			),
		},
		{
			title: 'Broj dokumenta',
			key: 'docsCount',
			render: (record: Report) => (
				<Text>{record.docsIssued?.length || 0}</Text>
			),
		},
		{
			title: 'Akcije',
			key: 'actions',
			render: (record: Report) => (
				<Space>
					<Button
						type='primary'
						icon={<EyeOutlined />}
						size='small'
						onClick={() => handleViewReport(record)}
					>
						Prikaži
					</Button>
				</Space>
			),
		},
	];

	// Calculate statistics
	const totalReports = reports.length;
	const duiReports = reports.filter((r: Report) => r.type === 'DUI').length;
	const docsReports = reports.filter((r: Report) => r.type === 'DOCS_ISSUED').length;
	const surveyReports = reports.filter((r: Report) => r.type === 'SURVEY').length;

	return (
		<div style={{ padding: '24px' }}>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<div>
					<Space
						align='center'
						style={{ width: '100%', justifyContent: 'space-between' }}
					>
						<div>
							<Space>
								<div>
									<Title level={2}>Izveštaji</Title>
									<Text type='secondary'>
										Upravljanje statističkim izveštajima
									</Text>
								</div>
							</Space>
						</div>
						<Button
							type='primary'
							icon={<PlusOutlined />}
							size='large'
							onClick={handleCreateReport}
						>
							Kreiraj izveštaj
						</Button>
					</Space>
				</div>

				{/* Statistics Cards */}
				<Row gutter={16}>
					<Col span={6}>
						<Card>
							<Statistic
								title='Ukupno izveštaja'
								value={totalReports}
								prefix={<FileTextOutlined />}
							/>
						</Card>
					</Col>
					<Col span={6}>
						<Card>
							<Statistic
								title='DUI izveštaji'
								value={duiReports}
								prefix={<BarChartOutlined />}
								valueStyle={{ color: '#cf1322' }}
							/>
						</Card>
					</Col>
					<Col span={6}>
						<Card>
							<Statistic
								title='Dokumenti izveštaji'
								value={docsReports}
								prefix={<DatabaseOutlined />}
								valueStyle={{ color: '#1890ff' }}
							/>
						</Card>
					</Col>
					<Col span={6}>
						<Card>
							<Statistic
								title='Anketa izveštaji'
								value={surveyReports}
								prefix={<BarChartOutlined />}
								valueStyle={{ color: '#52c41a' }}
							/>
						</Card>
					</Col>
				</Row>

				{/* Reports Table */}
				<Card
					title={
						<Space>
							<BarChartOutlined />
							<Text strong>Lista izveštaja</Text>
						</Space>
					}
				>
					<Table
						columns={columns}
						dataSource={reports}
						rowKey='id'
						loading={isLoadingReports}
						pagination={{
							pageSize: 10,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} od ${total} izveštaja`,
						}}
						scroll={{ x: 1000 }}
						size='small'
					/>
				</Card>

				{/* Create Report Modal */}
				<CreateReportModal
					open={isCreateReportModalOpen}
					onClose={handleModalClose}
					onSuccess={handleReportSuccess}
				/>

				{/* View Report Modal */}
				<Modal
					title='Detalji izveštaja'
					open={isViewModalOpen}
					onCancel={handleViewModalClose}
					footer={null}
					width={800}
					destroyOnClose
				>
					{selectedReport && (
						<Space direction='vertical' size='middle' style={{ width: '100%' }}>
							<Descriptions bordered column={1}>
								<Descriptions.Item label='Naziv'>
									{selectedReport.title}
								</Descriptions.Item>
								<Descriptions.Item label='Tip'>
									<Tag color={getReportTypeColor(selectedReport.type)}>
										{getReportTypeLabel(selectedReport.type)}
									</Tag>
								</Descriptions.Item>
								<Descriptions.Item label='Datum kreiranja'>
									{dayjs(selectedReport.generatedAt).format(
										'DD.MM.YYYY HH:mm:ss'
									)}
								</Descriptions.Item>
							</Descriptions>

							{selectedReport.type === 'DUI' && selectedReport.duiIndicators && (
								<>
									<Divider>DUI Statistike</Divider>
									<Table
										dataSource={selectedReport.duiIndicators}
										rowKey='id'
										pagination={false}
										size='small'
										columns={[
											{
												title: 'Godina',
												dataIndex: 'year',
												key: 'year',
											},
											{
												title: 'Opština',
												dataIndex: 'municipality',
												key: 'municipality',
											},
											{
												title: 'Tip',
												dataIndex: 'type',
												key: 'type',
											},
											{
												title: 'Broj slučajeva',
												dataIndex: 'caseCount',
												key: 'caseCount',
												render: (count: number) => (
													<Text strong>{count}</Text>
												),
											},
										]}
									/>
								</>
							)}

							{selectedReport.type === 'DOCS_ISSUED' && selectedReport.docsIssued && (
								<>
									<Divider>Statistike dokumenata</Divider>
									<Table
										dataSource={selectedReport.docsIssued}
										rowKey='id'
										pagination={false}
										size='small'
										columns={[
											{
												title: 'Period od',
												dataIndex: 'periodFrom',
												key: 'periodFrom',
												render: (date: string) =>
													dayjs(date).format('DD.MM.YYYY'),
											},
											{
												title: 'Period do',
												dataIndex: 'periodTo',
												key: 'periodTo',
												render: (date: string) =>
													dayjs(date).format('DD.MM.YYYY'),
											},
											{
												title: 'Tip dokumenta',
												dataIndex: 'documentType',
												key: 'documentType',
											},
											{
												title: 'Broj',
												dataIndex: 'count',
												key: 'count',
												render: (count: number) => (
													<Text strong>{count}</Text>
												),
											},
										]}
									/>
								</>
							)}

							{selectedReport.type === 'SURVEY' && (
								<>
									<Divider>Statistike ankete</Divider>
									{surveyStatistics ? (
										<>
											<Card size='small'>
												<Row gutter={16}>
													<Col span={6}>
														<Statistic
															title='Ukupno učesnika'
															value={surveyStatistics.totalParticipants}
															prefix={<UserOutlined />}
															valueStyle={{ color: '#1890ff' }}
														/>
													</Col>
													<Col span={6}>
														<Statistic
															title='Ukupno odgovora'
															value={surveyStatistics.totalAnswers}
															prefix={<FileTextOutlined />}
															valueStyle={{ color: '#52c41a' }}
														/>
													</Col>
													<Col span={6}>
														<Statistic
															title='Stopa odgovora'
															value={surveyStatistics.completionRate}
															suffix='%'
															prefix={<BarChartOutlined />}
															valueStyle={{ color: '#faad14' }}
														/>
													</Col>
													<Col span={6}>
														<Statistic
															title='Broj pitanja'
															value={surveyStatistics.questionsCount}
															prefix={<DatabaseOutlined />}
															valueStyle={{ color: '#722ed1' }}
														/>
													</Col>
												</Row>
											</Card>
											
											{surveyStatistics.responsesByQuestion.length > 0 && (
												<>
													<Divider>Analiza po pitanjima</Divider>
													<Table
														dataSource={surveyStatistics.responsesByQuestion}
														rowKey='questionId'
														pagination={false}
														size='small'
														columns={[
															{
																title: 'Pitanje',
																dataIndex: 'questionText',
																key: 'questionText',
																width: '50%',
																render: (text: string) => (
																	<Text ellipsis={{ tooltip: text }}>
																		{text}
																	</Text>
																),
															},
															{
																title: 'Broj odgovora',
																dataIndex: 'responseCount',
																key: 'responseCount',
																width: '25%',
																render: (count: number) => (
																	<Tag color={count > 0 ? 'green' : 'red'}>
																		{count}
																	</Tag>
																),
															},
															{
																title: 'Najčešći odgovor',
																dataIndex: 'mostCommonAnswer',
																key: 'mostCommonAnswer',
																width: '25%',
																render: (answer: string) => (
																	<Text ellipsis={{ tooltip: answer }}>
																		{answer}
																	</Text>
																),
															},
														]}
													/>
												</>
											)}
										</>
									) : (
										<Empty 
											description='Učitavanje anketa statistika...'
											style={{ marginTop: '20px' }}
										>
											<Spin />
										</Empty>
									)}
								</>
							)}
						</Space>
					)}
				</Modal>
			</Space>
		</div>
	);
};
