import React, { useState } from 'react';
import {
	Card,
	Form,
	Select,
	Button,
	Space,
	Typography,
	Row,
	Col,
	message,
	DatePicker,
	TimePicker,
	InputNumber,
	Input,
	Divider,
	Table,
	Tag,
	Tooltip,
	Upload,
	Spin,
} from 'antd';
import {
	UploadOutlined,
	FileOutlined,
	EyeOutlined,
	DownloadOutlined,
} from '@ant-design/icons';
import type { UploadFile } from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth';
import { requestApi, type CreateRequestData } from '../../api/request.api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export const Request: React.FC = () => {
	const { user } = useAuth();
	const [form] = Form.useForm();
	const [fileList, setFileList] = useState<UploadFile[]>([]);
	const [uploading, setUploading] = useState(false);
	const [loadingDocument, setLoadingDocument] = useState<string | null>(null);

	// React Query mutation for creating request
	const createRequestMutation = useMutation({
		mutationFn: (data: CreateRequestData) => requestApi.createRequest(data),
		onSuccess: () => {
			message.success('Zahtev je uspešno poslat!');
			form.resetFields();
			// Refetch requests after successful creation
			refetchRequests();
		},
		onError: (error: unknown) => {
			console.error('Error creating request:', error);
			message.error(
				(error as { response?: { data?: { message: string } } }).response?.data
					?.message || 'Došlo je do greške prilikom slanja zahteva'
			);
		},
	});

	// React Query for fetching requests
	const {
		data: requests = [],
		isLoading: isLoadingRequests,
		refetch: refetchRequests,
	} = useQuery({
		queryKey: ['requests', user?.id],
		queryFn: () => requestApi.getRequestsByCitizenId(user?.id || ''),
		enabled: !!user?.id,
	});

	const requestTypes = [
		{ value: 'ID_CARD', label: 'Lična karta' },
		{ value: 'PASSPORT', label: 'Pasos' },
		{ value: 'CITIZENSHIP', label: 'Državljanstvo' },
		{ value: 'DRIVING_LICENSE', label: 'Vozačka dozvola' },
	];

	const appointmentLocations = [
		{ value: 'MUP_BELGRADE', label: 'MUP Beograd' },
		{ value: 'MUP_NOVI_SAD', label: 'MUP Novi Sad' },
		{ value: 'MUP_NIS', label: 'MUP Niš' },
		{ value: 'MUP_KRAGUJEVAC', label: 'MUP Kragujevac' },
		{ value: 'MUP_SUBOTICA', label: 'MUP Subotica' },
	];

	const documentTypes = [
		{ value: 'BIRTH_CERTIFICATE', label: 'Rodni list' },
		{ value: 'MARRIAGE_CERTIFICATE', label: 'Venčani list' },
		{ value: 'DIVORCE_CERTIFICATE', label: 'List o razvodu' },
		{ value: 'DEATH_CERTIFICATE', label: 'Smrtni list' },
		{ value: 'CITIZENSHIP_CERTIFICATE', label: 'Potvrda o državljanstvu' },
		{ value: 'RESIDENCE_CERTIFICATE', label: 'Potvrda o prebivalištu' },
		{ value: 'CRIMINAL_RECORD', label: 'Potvrda o nekažnjavanju' },
		{ value: 'OTHER', label: 'Ostalo' },
	];

	// Helper functions for formatting
	const getRequestTypeLabel = (type: string) => {
		const requestType = requestTypes.find((rt) => rt.value === type);
		return requestType?.label || type;
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
				return 'green';
			default:
				return 'default';
		}
	};

	const getStatusLabel = (status: string) => {
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

	const getLocationLabel = (location: string) => {
		const locationObj = appointmentLocations.find(
			(loc) => loc.value === location
		);
		return locationObj?.label || location;
	};

	// Table columns definition
	const columns = [
		{
			title: 'Broj slučaja',
			dataIndex: 'caseNumber',
			key: 'caseNumber',
			width: 150,
			render: (text: string) => (
				<Tooltip title={text}>
					<Text code style={{ fontSize: '12px' }}>
						{text.length > 15 ? `${text.substring(0, 15)}...` : text}
					</Text>
				</Tooltip>
			),
		},
		{
			title: 'Tip zahteva',
			dataIndex: 'type',
			key: 'type',
			width: 120,
			render: (type: string) => getRequestTypeLabel(type),
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: 150,
			render: (
				status: string,
				record: CreateRequestData & { id: string; adminMessage?: string }
			) => (
				<Space direction='vertical' size='small'>
					<Tag color={getStatusColor(status)}>{getStatusLabel(status)}</Tag>
					{record.adminMessage && (
						<Tooltip title={record.adminMessage}>
							<Text
								type='secondary'
								style={{
									fontSize: '12px',
									maxWidth: 130,
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
			width: 120,
			render: (date: string) => dayjs(date).format('DD.MM.YYYY'),
		},
		{
			title: 'Termin',
			key: 'appointment',
			width: 150,
			render: (record: CreateRequestData & { id: string }) => {
				if (!record.appointment) return '-';
				return (
					<div>
						<div>{dayjs(record.appointment.dateTime).format('DD.MM.YYYY')}</div>
						<div style={{ fontSize: '12px', color: '#666' }}>
							{dayjs(record.appointment.dateTime).format('HH:mm')}
						</div>
					</div>
				);
			},
		},
		{
			title: 'Lokacija',
			key: 'location',
			width: 120,
			render: (record: CreateRequestData & { id: string }) => {
				if (!record.appointment?.location) return '-';
				return getLocationLabel(record.appointment.location);
			},
		},
		{
			title: 'Iznos',
			key: 'payment',
			width: 100,
			render: (record: CreateRequestData & { id: string }) => {
				if (!record.payment?.amount) return '-';
				return `${record.payment.amount.toLocaleString()} RSD`;
			},
		},
		{
			title: 'Dokument',
			key: 'document',
			width: 200,
			render: (record: CreateRequestData & { id: string }) => {
				if (!record.document) return '-';

				const handleDownload = async () => {
					const loadingKey = `download-${record.id}`;
					try {
						if (!record.document?.fileUrl) {
							message.error('Dokument nije dostupan');
							return;
						}
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
						message.success('Dokument se preuzima...');
					} catch (error) {
						console.error('Error downloading document:', error);
						message.error('Greška prilikom preuzimanja dokumenta');
					} finally {
						setLoadingDocument(null);
					}
				};

				const handlePreview = async () => {
					const loadingKey = `view-${record.id}`;
					try {
						if (!record.document?.fileUrl) {
							message.error('Dokument nije dostupan');
							return;
						}
						setLoadingDocument(loadingKey);
						const blob = await requestApi.getDocumentStream(
							record.document.fileUrl
						);
						const url = URL.createObjectURL(blob);
						window.open(url, '_blank');
						// Clean up the URL after a delay
						setTimeout(() => URL.revokeObjectURL(url), 100);
					} catch (error) {
						console.error('Error previewing document:', error);
						message.error('Greška prilikom pregleda dokumenta');
					} finally {
						setLoadingDocument(null);
					}
				};

				return (
					<Space direction='vertical' size='small'>
						<Tooltip title={record.document.name}>
							<Text ellipsis style={{ maxWidth: 150 }}>
								<FileOutlined /> {record.document.name}
							</Text>
						</Tooltip>
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
								onClick={handlePreview}
								disabled={loadingDocument === `view-${record.id}`}
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
							>
								{loadingDocument === `download-${record.id}`
									? 'Preuzimanje...'
									: 'Preuzmi'}
							</Button>
						</Space>
					</Space>
				);
			},
		},
	];

	const handleSubmit = async (values: {
		type: string;
		appointmentDate: dayjs.Dayjs;
		appointmentTime: dayjs.Dayjs;
		location: string;
		amount: number;
		referenceNumber: string;
		documentType: string;
		issuedDate: dayjs.Dayjs;
		documentFile: UploadFile[];
	}) => {
		try {
			setUploading(true);

			// Upload file first
			if (!fileList[0]) {
				message.error('Molimo priložite dokument');
				setUploading(false);
				return;
			}

			const formData = new FormData();
			formData.append('file', fileList[0] as unknown as Blob);

			const uploadResponse = await requestApi.uploadDocument(formData);

			// Generate random case number
			const caseNumber = `CASE-${Date.now()}-${Math.random()
				.toString(36)
				.substr(2, 9)
				.toUpperCase()}`;

			// Combine date and time for appointment
			const dateTime = dayjs(values.appointmentDate)
				.hour(values.appointmentTime.hour())
				.minute(values.appointmentTime.minute())
				.second(0)
				.millisecond(0);

			// Prepare data for API
			const requestData: CreateRequestData = {
				caseNumber,
				type: values.type,
				status: 'CREATED',
				submissionDate: dayjs().toISOString(),
				citizenId: user?.id || '',
				appointment: {
					dateTime: dateTime.toISOString(),
					location: values.location,
				},
				payment: {
					amount: values.amount,
					referenceNumber: values.referenceNumber,
				},
				document: {
					name: fileList[0].name,
					type: values.documentType,
					issuedDate: dayjs(values.issuedDate).toISOString(),
					fileUrl: uploadResponse.fileUrl,
					fileName: uploadResponse.fileName,
					fileSize: uploadResponse.fileSize,
					mimeType: fileList[0].type || '',
				},
			};

			// Send request using React Query mutation
			createRequestMutation.mutate(requestData);
			setFileList([]);
			setUploading(false);
		} catch (error) {
			console.error('Error creating request:', error);
			message.error('Došlo je do greške prilikom kreiranja zahteva');
			setUploading(false);
		}
	};

	return (
		<div style={{ padding: '24px' }}>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<div>
					<Title level={2}>Novi zahtev</Title>
					<Text type='secondary'>
						Popunite sve potrebne informacije za kreiranje novog zahteva
					</Text>
				</div>

				<Card>
					<Form form={form} layout='vertical'>
						{/* Basic Info */}
						<Title level={4}>Osnovni podaci</Title>
						<Row gutter={16}>
							<Col span={24}>
								<Form.Item
									name='type'
									label='Tip zahteva'
									rules={[
										{
											required: true,
											message: 'Molimo odaberite tip zahteva',
										},
									]}
								>
									<Select placeholder='Odaberite tip zahteva'>
										{requestTypes.map((type) => (
											<Option key={type.value} value={type.value}>
												{type.label}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<Divider />

						{/* Appointment */}
						<Title level={4}>Termin</Title>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='appointmentDate'
									label='Datum termina'
									rules={[
										{
											required: true,
											message: 'Molimo odaberite datum termina',
										},
									]}
								>
									<DatePicker
										style={{ width: '100%' }}
										format='YYYY-MM-DD'
										disabledDate={(current) =>
											current && current < dayjs().startOf('day')
										}
										placeholder='Odaberite datum'
									/>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='appointmentTime'
									label='Vreme termina'
									rules={[
										{
											required: true,
											message: 'Molimo odaberite vreme termina',
										},
									]}
								>
									<TimePicker
										style={{ width: '100%' }}
										format='HH:mm'
										minuteStep={15}
										placeholder='Odaberite vreme'
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={24}>
								<Form.Item
									name='location'
									label='Lokacija'
									rules={[
										{
											required: true,
											message: 'Molimo odaberite lokaciju',
										},
									]}
								>
									<Select placeholder='Odaberite lokaciju'>
										{appointmentLocations.map((location) => (
											<Option key={location.value} value={location.value}>
												{location.label}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<Divider />

						{/* Payment */}
						<Title level={4}>Plaćanje</Title>
						<Row gutter={16}>
							<Col span={24}>
								<Form.Item
									name='amount'
									label='Iznos za plaćanje (RSD)'
									rules={[
										{ required: true, message: 'Molimo unesite iznos' },
										{
											type: 'number',
											min: 1,
											message: 'Iznos mora biti veći od 0',
										},
									]}
								>
									<InputNumber
										style={{ width: '100%' }}
										placeholder='Unesite iznos u RSD'
										min={1}
										max={100000}
										formatter={(value) =>
											`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
										}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={24}>
								<Form.Item
									name='referenceNumber'
									label='Broj reference'
									rules={[
										{
											required: true,
											message: 'Molimo unesite broj reference',
										},
										{
											min: 10,
											message:
												'Broj reference mora imati najmanje 10 karaktera',
										},
									]}
								>
									<Input
										placeholder='Unesite broj reference (npr. 1234567890)'
										maxLength={20}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Divider />

						{/* Document Upload */}
						<Title level={4}>Dokument</Title>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='documentType'
									label='Tip dokumenta'
									rules={[
										{
											required: true,
											message: 'Molimo odaberite tip dokumenta',
										},
									]}
								>
									<Select placeholder='Odaberite tip dokumenta'>
										{documentTypes.map((type) => (
											<Option key={type.value} value={type.value}>
												{type.label}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='issuedDate'
									label='Datum izdavanja'
									rules={[
										{
											required: true,
											message: 'Molimo odaberite datum izdavanja',
										},
									]}
								>
									<DatePicker
										style={{ width: '100%' }}
										format='YYYY-MM-DD'
										disabledDate={(current) =>
											current && current > dayjs().endOf('day')
										}
										placeholder='Odaberite datum izdavanja'
									/>
								</Form.Item>
							</Col>
						</Row>
						<Row gutter={16}>
							<Col span={24}>
								<Form.Item
									name='documentFile'
									label='Priložite dokument'
									rules={[
										{
											required: true,
											message: 'Molimo priložite dokument',
										},
									]}
									valuePropName='fileList'
									getValueFromEvent={(e) => {
										if (Array.isArray(e)) {
											return e;
										}
										return e?.fileList;
									}}
								>
									<Upload
										fileList={fileList}
										beforeUpload={(file) => {
											// Validate file type
											const allowedTypes = [
												'application/pdf',
												'image/jpeg',
												'image/jpg',
												'image/png',
												'application/msword',
												'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
											];
											if (!allowedTypes.includes(file.type)) {
												message.error(
													'Možete priložiti samo PDF, Word ili slike (JPG, PNG)!'
												);
												return Upload.LIST_IGNORE;
											}
											// Validate file size (max 10MB)
											if (file.size / 1024 / 1024 > 10) {
												message.error('Fajl mora biti manji od 10MB!');
												return Upload.LIST_IGNORE;
											}
											setFileList([file]);
											return false; // Prevent auto upload
										}}
										onRemove={() => {
											setFileList([]);
										}}
										maxCount={1}
									>
										<Button
											icon={<UploadOutlined />}
											disabled={fileList.length >= 1}
										>
											Kliknite da priložite dokument
										</Button>
									</Upload>
								</Form.Item>
								<Text type='secondary' style={{ fontSize: '12px' }}>
									Dozvoljeni formati: PDF, Word, JPG, PNG (Maksimalno 10MB)
								</Text>
							</Col>
						</Row>

						{/* Submit Button */}
						<Row justify='end' style={{ marginTop: '24px' }}>
							<Button
								type='primary'
								htmlType='button'
								size='large'
								loading={createRequestMutation.isPending || uploading}
								onClick={() => {
									form
										.validateFields()
										.then((values) => {
											handleSubmit(values);
										})
										.catch((errorInfo) => {
											console.log('Validation failed:', errorInfo);
										});
								}}
							>
								{uploading
									? 'Prilaže se dokument...'
									: createRequestMutation.isPending
									? 'Šalje se...'
									: 'Pošalji zahtev'}
							</Button>
						</Row>
					</Form>
				</Card>

				{/* Requests Table */}
				<Card>
					<Space direction='vertical' size='middle' style={{ width: '100%' }}>
						<div>
							<Title level={3} style={{ margin: 0 }}>
								Moji zahtevi
							</Title>
							<Text type='secondary'>
								Pregled svih vaših poslatih zahteva i njihovih statusa
							</Text>
						</div>

						<Table
							columns={columns}
							dataSource={requests}
							rowKey='id'
							loading={isLoadingRequests}
							pagination={{
								pageSize: 10,
								showSizeChanger: true,
								showQuickJumper: true,
								showTotal: (total, range) =>
									`${range[0]}-${range[1]} od ${total} zahteva`,
							}}
							scroll={{ x: 1000 }}
							size='small'
							bordered
						/>
					</Space>
				</Card>
			</Space>
		</div>
	);
};
