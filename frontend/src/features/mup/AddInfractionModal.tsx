import React from 'react';
import {
	Modal,
	Form,
	Input,
	Select,
	InputNumber,
	DatePicker,
	Button,
	Space,
	Typography,
	Row,
	Col,
	message,
} from 'antd';
import { useMutation } from '@tanstack/react-query';
import {
	infractionApi,
	type CreateInfractionData,
	InfractionType,
} from '../../api/infraction.api';
import { type Citizen } from '../../api/citizen.api';
import type { Dayjs } from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface AddInfractionModalProps {
	open: boolean;
	onClose: () => void;
	citizen: Citizen | null;
	onSuccess: () => void;
}

export const AddInfractionModal: React.FC<AddInfractionModalProps> = ({
	open,
	onClose,
	citizen,
	onSuccess,
}) => {
	const [form] = Form.useForm();

	// Create infraction mutation
	const createInfractionMutation = useMutation({
		mutationFn: (data: CreateInfractionData) =>
			infractionApi.createInfraction(data),
		onSuccess: () => {
			onSuccess();
		},
		onError: (error: unknown) => {
			console.error('Error creating infraction:', error);
			message.error(
				(error as { response?: { data?: { message: string } } }).response?.data
					?.message || 'Došlo je do greške prilikom dodavanja prekršaja'
			);
		},
	});

	const handleSubmit = async (values: {
		dateTime: Dayjs;
		municipality: string;
		description: string;
		penaltyPoints: number;
		fine: number;
		type: InfractionType;
	}) => {
		try {
			const infractionData: CreateInfractionData = {
				dateTime: values.dateTime.toISOString(),
				municipality: values.municipality,
				description: values.description,
				penaltyPoints: values.penaltyPoints,
				fine: values.fine,
				type: values.type,
				citizenId: citizen?.id || '',
			};

			createInfractionMutation.mutate(infractionData);
		} catch (error) {
			console.error('Error creating infraction:', error);
			message.error('Molimo popunite sva obavezna polja');
		}
	};

	const handleCancel = () => {
		form.resetFields();
		onClose();
	};

	const infractionTypes = [
		{ value: 'DRUNK_DRIVING', label: 'Vožnja u alkoholisanom stanju' },
		{ value: 'SPEEDING', label: 'Prekoračenje brzine' },
		{ value: 'RED_LIGHT_VIOLATION', label: 'Prolazak na crveno svetlo' },
		{ value: 'NO_SEATBELT', label: 'Nevezivanje sigurnosnog pojasa' },
	];

	const municipalities = [
		'Beograd',
		'Novi Sad',
		'Niš',
		'Kragujevac',
		'Subotica',
		'Zrenjanin',
		'Pančevo',
		'Čačak',
		'Kraljevo',
		'Novi Pazar',
	];

	return (
		<Modal
			title={
				<Space>
					<Title level={4} style={{ margin: 0 }}>
						Dodaj prekršaj
					</Title>
					{citizen && (
						<Text type='secondary'>
							za {citizen.firstName} {citizen.lastName}
						</Text>
					)}
				</Space>
			}
			open={open}
			onCancel={handleCancel}
			footer={null}
			width={800}
		>
			<Form form={form} layout='vertical' onFinish={handleSubmit}>
				{/* Citizen Info */}
				{citizen && (
					<div
						style={{
							padding: '12px',
							backgroundColor: '#f5f5f5',
							borderRadius: '6px',
							marginBottom: 16,
						}}
					>
						<Space direction='vertical' size='small'>
							<Text strong>Građanin:</Text>
							<Text>
								{citizen.firstName} {citizen.lastName} (JMBG: {citizen.jmbg})
							</Text>
						</Space>
					</div>
				)}

				{/* Infraction Details */}
				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='dateTime'
							label='Datum i vreme prekršaja'
							rules={[
								{
									required: true,
									message: 'Molimo odaberite datum i vreme',
								},
							]}
						>
							<DatePicker
								showTime
								style={{ width: '100%' }}
								format='YYYY-MM-DD HH:mm'
								placeholder='Odaberite datum i vreme'
							/>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='municipality'
							label='Opština'
							rules={[
								{
									required: true,
									message: 'Molimo odaberite opštinu',
								},
							]}
						>
							<Select placeholder='Odaberite opštinu'>
								{municipalities.map((municipality) => (
									<Option key={municipality} value={municipality}>
										{municipality}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='type'
							label='Tip prekršaja'
							rules={[
								{
									required: true,
									message: 'Molimo odaberite tip prekršaja',
								},
							]}
						>
							<Select placeholder='Odaberite tip prekršaja'>
								{infractionTypes.map((type) => (
									<Option key={type.value} value={type.value}>
										{type.label}
									</Option>
								))}
							</Select>
						</Form.Item>
					</Col>
					<Col span={12}>
						<Form.Item
							name='penaltyPoints'
							label='Kazneni poeni'
							rules={[
								{
									required: true,
									message: 'Molimo unesite broj kaznenih poena',
								},
								{
									type: 'number',
									min: 0,
									max: 12,
									message: 'Kazneni poeni moraju biti između 0 i 12',
								},
							]}
						>
							<InputNumber
								style={{ width: '100%' }}
								placeholder='Unesite broj poena'
								min={0}
								max={12}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<Form.Item
							name='fine'
							label='Novčana kazna (RSD)'
							rules={[
								{
									required: true,
									message: 'Molimo unesite iznos kazne',
								},
								{
									type: 'number',
									min: 0,
									message: 'Kazna mora biti veća od 0',
								},
							]}
						>
							<InputNumber
								style={{ width: '100%' }}
								placeholder='Unesite iznos kazne'
								min={0}
								formatter={(value) =>
									`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
								}
							/>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					name='description'
					label='Opis prekršaja'
					rules={[
						{
							required: true,
							message: 'Molimo unesite opis prekršaja',
						},
						{
							min: 10,
							message: 'Opis mora imati najmanje 10 karaktera',
						},
					]}
				>
					<TextArea
						rows={4}
						placeholder='Unesite detaljan opis prekršaja...'
						maxLength={500}
						showCount
					/>
				</Form.Item>

				{/* Modal Footer */}
				<Row justify='end' style={{ marginTop: 24 }}>
					<Space>
						<Button onClick={handleCancel}>Otkaži</Button>
						<Button
							type='primary'
							htmlType='submit'
							loading={createInfractionMutation.isPending}
						>
							{createInfractionMutation.isPending
								? 'Dodaje se...'
								: 'Dodaj prekršaj'}
						</Button>
					</Space>
				</Row>
			</Form>
		</Modal>
	);
};
