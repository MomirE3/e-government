import React, { useState } from 'react';
import {
	Card,
	Button,
	Space,
	Typography,
	Table,
	Tag,
	Form,
	Select,
	Row,
	Col,
	Tooltip,
	message,
	Spin,
	Modal,
	Input,
} from 'antd';
import {
	FileSearchOutlined,
	ArrowLeftOutlined,
	FilterOutlined,
	FileOutlined,
	EyeOutlined,
	DownloadOutlined,
	FilePdfOutlined,
	FileWordOutlined,
	FileImageOutlined,
	EditOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	requestApi,
	type Request,
	type FilterRequestParams,
	type UpdateRequestStatusData,
} from '../../api/request.api';
import { citizenApi, type Citizen } from '../../api/citizen.api';
import { useAuth } from '../auth';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

const { TextArea } = Input;

export const RequestsPage: React.FC = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [statusForm] = Form.useForm();
	const [filters, setFilters] = useState<FilterRequestParams>({});
	const [loadingDocument, setLoadingDocument] = useState<string | null>(null);
	const [statusModalVisible, setStatusModalVisible] = useState(false);
	const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
	const queryClient = useQueryClient();
	const { user } = useAuth();

	// Fetch all citizens for filter dropdown
	const { data: allCitizens = [] } = useQuery({
		queryKey: ['citizens'],
		queryFn: citizenApi.getAllCitizens,
	});

	// Filter out admins - only show citizens
	const citizens = allCitizens.filter(
		(citizen: Citizen) => citizen.role === 'CITIZEN'
	);

	// Fetch requests with current filters
	const { data: requests = [], isLoading } = useQuery({
		queryKey: ['requests', filters],
		queryFn: () => requestApi.filterRequests(filters),
	});

	// Mutation for updating request status
	const updateStatusMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateRequestStatusData }) =>
			requestApi.updateRequestStatus(id, data),
		onSuccess: () => {
			message.success('Status zahteva je uspešno ažuriran');
			// Invalidate both queries to ensure data is refreshed
			queryClient.invalidateQueries({ queryKey: ['requests'] });
			queryClient.invalidateQueries({ queryKey: ['filteredRequests'] });
			setStatusModalVisible(false);
			setSelectedRequest(null);
			statusForm.resetFields();
		},
		onError: () => {
			message.error('Greška prilikom ažuriranja statusa');
		},
	});

	const handleFilter = () => {
		const formValues = form.getFieldsValue();
		setFilters(formValues);
	};

	const handleClearFilters = () => {
		form.resetFields();
		setFilters({});
	};

	const handleStatusChange = (record: Request) => {
		setSelectedRequest(record);
		statusForm.setFieldsValue({
			status: record.status,
			adminMessage: record.adminMessage || '',
		});
		setStatusModalVisible(true);
	};

	const handleStatusSubmit = () => {
		statusForm.validateFields().then((values) => {
			if (selectedRequest) {
				updateStatusMutation.mutate({
					id: selectedRequest.id,
					data: values,
				});
			}
		});
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case 'CREATED':
				return 'blue';
			case 'IN_PROCESS':
				return 'orange';
			case 'APPROVED':
				return 'green';
			case 'REJECTED':
				return 'red';
			case 'COMPLETED':
				return 'purple';
			default:
				return 'default';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'CREATED':
				return 'Kreiran';
			case 'IN_PROCESS':
				return 'U toku';
			case 'APPROVED':
				return 'Odobren';
			case 'REJECTED':
				return 'Odbijen';
			case 'COMPLETED':
				return 'Završen';
			default:
				return status;
		}
	};

	const getTypeText = (type: string) => {
		switch (type) {
			case 'ID_CARD':
				return 'Lična karta';
			case 'PASSPORT':
				return 'Pasoš';
			case 'CITIZENSHIP':
				return 'Državljanstvo';
			case 'DRIVING_LICENSE':
				return 'Vozačka dozvola';
			default:
				return type;
		}
	};

	const columns = [
		{
			title: 'Broj predmeta',
			dataIndex: 'caseNumber',
			key: 'caseNumber',
			width: 150,
		},
		{
			title: 'Tip zahteva',
			dataIndex: 'type',
			key: 'type',
			width: 150,
			render: (type: string) => getTypeText(type),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: 120,
			render: (status: string, record: Request) => (
				<Space direction='vertical' size='small'>
					<Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
					{record.adminMessage && (
						<Tooltip title={record.adminMessage}>
							<Text
								type='secondary'
								style={{
									fontSize: '12px',
									maxWidth: 100,
									display: 'block',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								}}
							>
								💬 {record.adminMessage}
							</Text>
						</Tooltip>
					)}
				</Space>
			),
		},
		{
			title: 'Datum podnošenja',
			dataIndex: 'submissionDate',
			key: 'submissionDate',
			width: 150,
			render: (date: string) => dayjs(date).format('DD.MM.YYYY'),
		},
		{
			title: 'ID građanina',
			dataIndex: 'citizenId',
			key: 'citizenId',
			width: 200,
		},
		{
			title: 'Zakazani termin',
			key: 'appointment',
			width: 200,
			render: (record: Request) => {
				if (record.appointment) {
					return (
						<div>
							<div>
								{dayjs(record.appointment.dateTime).format('DD.MM.YYYY HH:mm')}
							</div>
							<Text type='secondary' style={{ fontSize: '12px' }}>
								{record.appointment.location}
							</Text>
						</div>
					);
				}
				return <Text type='secondary'>Nije zakazan</Text>;
			},
		},
		{
			title: 'Plaćanje',
			key: 'payment',
			width: 150,
			render: (record: Request) => {
				if (record.payment) {
					return (
						<div>
							<div>{record.payment.amount} RSD</div>
							<Text type='secondary' style={{ fontSize: '12px' }}>
								Ref: {record.payment.referenceNumber}
							</Text>
						</div>
					);
				}
				return <Text type='secondary'>Nije plaćeno</Text>;
			},
		},
		{
			title: 'Dokument',
			key: 'document',
			width: 250,
			render: (record: Request) => {
				if (!record.document) {
					return <Text type='secondary'>Nije izdat</Text>;
				}

				const isImage = (mime?: string) => mime?.startsWith('image/') || false;
				const isPdf = (mime?: string) => mime === 'application/pdf';
				const isWord = (mime?: string) =>
					mime?.includes('word') || mime?.includes('document');

				const getFileIcon = () => {
					if (isImage(record.document?.mimeType)) {
						return (
							<FileImageOutlined style={{ fontSize: 20, color: '#52c41a' }} />
						);
					}
					if (isPdf(record.document?.mimeType)) {
						return (
							<FilePdfOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
						);
					}
					if (isWord(record.document?.mimeType)) {
						return (
							<FileWordOutlined style={{ fontSize: 20, color: '#1890ff' }} />
						);
					}
					return <FileOutlined style={{ fontSize: 20, color: '#8c8c8c' }} />;
				};

				const handleView = async () => {
					if (!record.document?.fileUrl) {
						message.error('Dokument nije dostupan');
						return;
					}
					const loadingKey = `view-${record.id}`;
					try {
						setLoadingDocument(loadingKey);
						const blob = await requestApi.getDocumentStream(
							record.document.fileUrl
						);
						const url = URL.createObjectURL(blob);
						window.open(url, '_blank');
						// Clean up the URL after a delay
						setTimeout(() => URL.revokeObjectURL(url), 100);
					} catch (error) {
						message.error('Greška pri otvaranju dokumenta');
						console.error(error);
					} finally {
						setLoadingDocument(null);
					}
				};

				const handleDownload = async () => {
					if (!record.document?.fileUrl) {
						message.error('Dokument nije dostupan');
						return;
					}
					const loadingKey = `download-${record.id}`;
					try {
						setLoadingDocument(loadingKey);
						const blob = await requestApi.getDocumentStream(
							record.document.fileUrl
						);
						const url = URL.createObjectURL(blob);
						const link = document.createElement('a');
						link.href = url;
						link.download = record.document.fileName || record.document.name;
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);
						URL.revokeObjectURL(url);
						message.success('Preuzimanje započeto');
					} catch (error) {
						message.error('Greška pri preuzimanju dokumenta');
						console.error(error);
					} finally {
						setLoadingDocument(null);
					}
				};

				return (
					<Space direction='vertical' size='small' style={{ width: '100%' }}>
						<Space align='center'>
							{getFileIcon()}
							<div style={{ flex: 1, minWidth: 0 }}>
								<Tooltip
									title={record.document.fileName || record.document.name}
								>
									<div
										style={{
											maxWidth: 150,
											whiteSpace: 'nowrap',
											overflow: 'hidden',
											textOverflow: 'ellipsis',
											fontWeight: 500,
										}}
									>
										{record.document.fileName || record.document.name}
									</div>
								</Tooltip>
								<Text type='secondary' style={{ fontSize: '11px' }}>
									{record.document.type}
									{record.document.fileSize &&
										` • ${(record.document.fileSize / 1024).toFixed(1)} KB`}
								</Text>
							</div>
						</Space>
						{record.document.fileUrl && (
							<Space size='small'>
								<Button
									type='link'
									size='small'
									icon={
										loadingDocument === `view-${record.id}` ? (
											<Spin size='small' />
										) : (
											<EyeOutlined />
										)
									}
									onClick={handleView}
									disabled={loadingDocument === `view-${record.id}`}
									style={{ padding: '0 4px', height: 'auto' }}
								>
									{loadingDocument === `view-${record.id}`
										? 'Učitavanje...'
										: 'Pregledaj'}
								</Button>
								<Button
									type='link'
									size='small'
									icon={
										loadingDocument === `download-${record.id}` ? (
											<Spin size='small' />
										) : (
											<DownloadOutlined />
										)
									}
									onClick={handleDownload}
									disabled={loadingDocument === `download-${record.id}`}
									style={{ padding: '0 4px', height: 'auto' }}
								>
									{loadingDocument === `download-${record.id}`
										? 'Preuzimanje...'
										: 'Preuzmi'}
								</Button>
							</Space>
						)}
					</Space>
				);
			},
		},
		{
			title: 'Akcije',
			key: 'actions',
			width: 120,
			render: (record: Request) => {
				// Only admins can change status
				if (user?.role !== 'ADMIN') return null;

				return (
					<Button
						type='link'
						size='small'
						icon={<EditOutlined />}
						onClick={() => handleStatusChange(record)}
					>
						Promeni status
					</Button>
				);
			},
		},
	];

	return (
		<div style={{ padding: '24px' }}>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				{/* Header */}
				<div>
					<Space
						align='center'
						style={{ width: '100%', justifyContent: 'space-between' }}
					>
						<Space>
							<Button
								icon={<ArrowLeftOutlined />}
								onClick={() => navigate('/mup')}
							>
								Nazad
							</Button>
							<div>
								<Title level={2} style={{ margin: 0 }}>
									Zahtevi
								</Title>
								<Text type='secondary'>Pregled i filtriranje zahteva</Text>
							</div>
						</Space>
					</Space>
				</div>

				{/* Filter Form */}
				<Card
					title={
						<Space>
							<FilterOutlined />
							<Text strong>Filteri</Text>
						</Space>
					}
					size='small'
				>
					<Form form={form} layout='inline' style={{ marginBottom: 16 }}>
						<Row gutter={16} style={{ width: '100%' }}>
							<Col span={6}>
								<Form.Item name='citizenId' label='Građanin'>
									<Select
										placeholder='Izaberite građanina'
										allowClear
										showSearch
										optionFilterProp='children'
										filterOption={(input, option) =>
											(option?.children as unknown as string)
												?.toLowerCase()
												.includes(input.toLowerCase())
										}
									>
										{citizens.map((citizen: Citizen) => (
											<Option key={citizen.id} value={citizen.id}>
												{citizen.firstName} {citizen.lastName} ({citizen.jmbg})
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col span={6}>
								<Form.Item name='requestStatus' label='Status'>
									<Select placeholder='Izaberite status' allowClear>
										<Option value='CREATED'>Kreiran</Option>
										<Option value='IN_PROCESS'>U toku</Option>
										<Option value='APPROVED'>Odobren</Option>
										<Option value='REJECTED'>Odbijen</Option>
										<Option value='COMPLETED'>Završen</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={6}>
								<Form.Item name='requestType' label='Tip zahteva'>
									<Select placeholder='Izaberite tip' allowClear>
										<Option value='ID_CARD'>Lična karta</Option>
										<Option value='PASSPORT'>Pasoš</Option>
										<Option value='CITIZENSHIP'>Državljanstvo</Option>
										<Option value='DRIVING_LICENSE'>Vozačka dozvola</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col span={6}>
								<Space>
									<Button
										type='primary'
										htmlType='button'
										onClick={handleFilter}
										icon={<FileSearchOutlined />}
									>
										Pretraži
									</Button>
									<Button onClick={handleClearFilters}>Obriši filtere</Button>
								</Space>
							</Col>
						</Row>
					</Form>
				</Card>

				{/* Results Info */}
				{Object.keys(filters).length > 0 && (
					<Card size='small'>
						<Space>
							<Text strong>Rezultati pretrage:</Text>
							<Text>{requests.length} zahteva pronađeno</Text>
							{Object.entries(filters).map(
								([key, value]) =>
									value && (
										<Tag
											key={key}
											closable
											onClose={() => {
												const newFilters = { ...filters };
												delete newFilters[key as keyof FilterRequestParams];
												setFilters(newFilters);
												form.setFieldsValue({ [key]: undefined });
											}}
										>
											{key}: {value}
										</Tag>
									)
							)}
						</Space>
					</Card>
				)}

				{/* Requests Table */}
				<Card
					title={
						<Space>
							<FileSearchOutlined />
							<Text strong>Lista zahteva</Text>
						</Space>
					}
				>
					<Table
						columns={columns}
						dataSource={requests}
						rowKey='id'
						loading={isLoading}
						pagination={{
							pageSize: 10,
							showSizeChanger: true,
							showQuickJumper: true,
							showTotal: (total, range) =>
								`${range[0]}-${range[1]} od ${total} zahteva`,
						}}
						scroll={{ x: 1200 }}
						locale={{
							emptyText:
								Object.keys(filters).length > 0
									? 'Nema rezultata za zadate filtere'
									: 'Kliknite "Pretraži" da vidite zahteve',
						}}
					/>
				</Card>

				{/* Status Update Modal */}
				<Modal
					title='Promeni status zahteva'
					open={statusModalVisible}
					onOk={handleStatusSubmit}
					onCancel={() => {
						setStatusModalVisible(false);
						setSelectedRequest(null);
						statusForm.resetFields();
					}}
					confirmLoading={updateStatusMutation.isPending}
					okText='Sačuvaj'
					cancelText='Otkaži'
					width={600}
				>
					{selectedRequest && (
						<Space direction='vertical' size='middle' style={{ width: '100%' }}>
							<div>
								<Text strong>Broj predmeta: </Text>
								<Text>{selectedRequest.caseNumber}</Text>
							</div>
							<div>
								<Text strong>Trenutni status: </Text>
								<Tag color={getStatusColor(selectedRequest.status)}>
									{getStatusText(selectedRequest.status)}
								</Tag>
							</div>
							{selectedRequest.adminMessage && (
								<div>
									<Text strong>Trenutna poruka: </Text>
									<Text type='secondary'>{selectedRequest.adminMessage}</Text>
								</div>
							)}

							<Form
								form={statusForm}
								layout='vertical'
								style={{ marginTop: 16 }}
							>
								<Form.Item
									name='status'
									label='Novi status'
									rules={[
										{ required: true, message: 'Molimo izaberite status' },
									]}
								>
									<Select placeholder='Izaberite status'>
										<Option value='CREATED'>Kreiran</Option>
										<Option value='IN_PROCESS'>U toku</Option>
										<Option value='APPROVED'>Odobren</Option>
										<Option value='REJECTED'>Odbijen</Option>
										<Option value='COMPLETED'>Završen</Option>
									</Select>
								</Form.Item>

								<Form.Item
									name='adminMessage'
									label='Poruka za građanina'
									tooltip='Ova poruka će biti vidljiva građaninu'
									rules={[
										{
											required:
												statusForm.getFieldValue('status') === 'REJECTED',
											message: 'Poruka je obavezna za odbijene zahteve',
										},
									]}
								>
									<TextArea
										rows={4}
										placeholder='Unesite poruku za građanina (razlog odbijanja, dodatne informacije, itd.)'
										maxLength={500}
										showCount
									/>
								</Form.Item>
							</Form>
						</Space>
					)}
				</Modal>
			</Space>
		</div>
	);
};
