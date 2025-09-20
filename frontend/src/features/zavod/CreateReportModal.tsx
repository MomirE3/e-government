import React, { useState } from 'react';
import {
	Modal,
	Form,
	Input,
	InputNumber,
	Button,
	Space,
	Typography,
	message,
	Row,
	Col,
	Divider,
	Select,
	DatePicker,
} from 'antd';
import { useMutation } from '@tanstack/react-query';
import { surveyApi } from '../../api/survey.api';
import dayjs from 'dayjs';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface CreateReportModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

interface DUIReportForm {
	year: number;
}

interface DocsReportForm {
	periodFrom: string;
	periodTo: string;
	title: string;
}

type ReportType = 'dui' | 'docs';

export const CreateReportModal: React.FC<CreateReportModalProps> = ({
	open,
	onClose,
	onSuccess,
}) => {
	const [form] = Form.useForm();
	const [reportType, setReportType] = useState<ReportType>('dui');

	// Create DUI report mutation
	const createDUIReportMutation = useMutation({
		mutationFn: async (data: DUIReportForm) => {
			const result = await surveyApi.createDUIReport(data);
			return result;
		},
		onSuccess: () => {
			message.success('DUI izveštaj je uspešno kreiran');
			onSuccess();
			onClose();
			form.resetFields();
		},
		onError: (error: unknown) => {
			console.error('Error creating DUI report:', error);
			message.error(
				(error as { response?: { data?: { message: string } } }).response?.data
					?.message || 'Došlo je do greške prilikom kreiranja DUI izveštaja'
			);
		},
	});

	// Create docs report mutation
	const createDocsReportMutation = useMutation({
		mutationFn: async (data: DocsReportForm) => {
			const result = await surveyApi.createDocsReport(data);
			return result;
		},
		onSuccess: () => {
			message.success('Izveštaj o dokumentima je uspešno kreiran');
			onSuccess();
			onClose();
			form.resetFields();
		},
		onError: (error: unknown) => {
			console.error('Error creating docs report:', error);
			message.error(
				(error as { response?: { data?: { message: string } } }).response?.data
					?.message || 'Došlo je do greške prilikom kreiranja izveštaja o dokumentima'
			);
		},
	});

	const handleSubmit = async (values: any) => {
		try {
			if (reportType === 'dui') {
				createDUIReportMutation.mutate(values);
			} else {
				// Handle date range for docs report
				const { period, title } = values;
				const docsData = {
					periodFrom: period[0].format('YYYY-MM-DD'),
					periodTo: period[1].format('YYYY-MM-DD'),
					title,
				};
				createDocsReportMutation.mutate(docsData);
			}
		} catch (error) {
			console.error('Error creating report:', error);
			message.error('Molimo popunite sva obavezna polja');
		}
	};

	const handleCancel = () => {
		onClose();
		form.resetFields();
		setReportType('dui');
	};

	const handleReportTypeChange = (value: ReportType) => {
		setReportType(value);
		form.resetFields();
	};

	const isLoading = createDUIReportMutation.isPending || createDocsReportMutation.isPending;

	return (
		<Modal
			title='Kreiraj izveštaj'
			open={open}
			onCancel={handleCancel}
			footer={null}
			width={600}
			destroyOnClose
		>
			<Space direction='vertical' size='middle' style={{ width: '100%' }}>
				<Divider />

				{/* Report type selection */}
				<Form.Item
					label='Tip izveštaja'
					initialValue='dui'
					rules={[{ required: true, message: 'Molimo odaberite tip izveštaja' }]}
				>
					<Select
						value={reportType}
						onChange={handleReportTypeChange}
						options={[
							{ value: 'dui', label: 'DUI izveštaj (alkoholizovana vožnja)' },
							{ value: 'docs', label: 'Izveštaj o dokumentima' },
						]}
					/>
				</Form.Item>

				<Divider />

				{/* Report form */}
				<Form
					form={form}
					layout='vertical'
					onFinish={handleSubmit}
					initialValues={{
						year: new Date().getFullYear(),
						title: '',
					}}
				>
					{reportType === 'dui' ? (
						// DUI Report Form
						<Form.Item
							name='year'
							label='Godina'
							rules={[
								{ required: true, message: 'Molimo unesite godinu' },
								{
									type: 'number',
									min: 2000,
									max: new Date().getFullYear() + 1,
									message: `Godina mora biti između 2000 i ${new Date().getFullYear() + 1}`,
								},
							]}
						>
							<InputNumber
								placeholder='Unesite godinu'
								style={{ width: '100%' }}
								min={2000}
								max={new Date().getFullYear() + 1}
							/>
						</Form.Item>
					) : (
						// Docs Report Form
						<>
							<Form.Item
								name='title'
								label='Naziv izveštaja'
								rules={[
									{ required: true, message: 'Molimo unesite naziv izveštaja' },
									{ min: 3, message: 'Naziv mora imati najmanje 3 karaktera' },
								]}
							>
								<Input placeholder='Unesite naziv izveštaja' />
							</Form.Item>

							<Form.Item
								name='period'
								label='Period'
								rules={[
									{ required: true, message: 'Molimo odaberite period' },
								]}
							>
								<RangePicker
									style={{ width: '100%' }}
									placeholder={['Datum od', 'Datum do']}
									format='YYYY-MM-DD'
								/>
							</Form.Item>
						</>
					)}

					<Divider />

					{/* Actions */}
					<Row justify='end' gutter={8}>
						<Col>
							<Button onClick={handleCancel}>Otkaži</Button>
						</Col>
						<Col>
							<Button
								type='primary'
								htmlType='submit'
								loading={isLoading}
							>
								{isLoading ? 'Kreira se...' : 'Kreiraj izveštaj'}
							</Button>
						</Col>
					</Row>
				</Form>
			</Space>
		</Modal>
	);
};
