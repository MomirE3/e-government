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
} from 'antd';
import {
	FileSearchOutlined,
	ArrowLeftOutlined,
	FilterOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
	requestApi,
	type Request,
	type FilterRequestParams,
} from '../../api/request.api';
import { citizenApi, type Citizen } from '../../api/citizen.api';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;

export const RequestsPage: React.FC = () => {
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [filters, setFilters] = useState<FilterRequestParams>({});

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

	const handleFilter = () => {
		const formValues = form.getFieldsValue();
		setFilters(formValues);
	};

	const handleClearFilters = () => {
		form.resetFields();
		setFilters({});
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
			render: (status: string) => (
				<Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
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
			width: 150,
			render: (record: Request) => {
				if (record.document) {
					return (
						<div>
							<div>{record.document.name}</div>
							<Text type='secondary' style={{ fontSize: '12px' }}>
								{record.document.type}
							</Text>
						</div>
					);
				}
				return <Text type='secondary'>Nije izdat</Text>;
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
			</Space>
		</div>
	);
};
