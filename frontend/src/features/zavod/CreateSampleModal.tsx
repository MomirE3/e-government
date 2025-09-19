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
} from 'antd';
import { useMutation } from '@tanstack/react-query';
import { surveyApi } from '../../api/survey.api';

const { Text } = Typography;

interface CreateSampleModalProps {
	open: boolean;
	onClose: () => void;
	survey: {
		id: string;
		title: string;
	} | null;
	onSuccess: () => void;
}

interface SampleForm {
	size: number;
	criteria: string;
}

export const CreateSampleModal: React.FC<CreateSampleModalProps> = ({
	open,
	onClose,
	survey,
	onSuccess,
}) => {
	const [form] = Form.useForm();

	// Create sample mutation
	const createSampleMutation = useMutation({
		mutationFn: async (sampleData: { size: number; criteria: string }) => {
			const result = await surveyApi.createSample(survey?.id || '', sampleData);
			return result;
		},
		onSuccess: () => {
			message.success('Uzorak je uspešno kreiran');
			onSuccess();
			onClose();
			form.resetFields();
		},
		onError: (error: unknown) => {
			console.error('Error creating sample:', error);
			message.error(
				(error as { response?: { data?: { message: string } } }).response?.data
					?.message || 'Došlo je do greške prilikom kreiranja uzorka'
			);
		},
	});

	const handleSubmit = async (values: SampleForm) => {
		try {
			createSampleMutation.mutate(values);
		} catch (error) {
			console.error('Error creating sample:', error);
			message.error('Molimo popunite sva obavezna polja');
		}
	};

	const handleCancel = () => {
		onClose();
		form.resetFields();
	};

	return (
		<Modal
			title='Kreiraj uzorak'
			open={open}
			onCancel={handleCancel}
			footer={null}
			width={500}
			destroyOnClose
		>
			<Space direction='vertical' size='middle' style={{ width: '100%' }}>
				{/* Survey info */}
				{survey && (
					<div
						style={{
							padding: '12px',
							backgroundColor: '#f5f5f5',
							borderRadius: '6px',
							marginBottom: 16,
						}}
					>
						<Space direction='vertical' size='small'>
							<Text strong>Anketa:</Text>
							<Text>{survey.title}</Text>
						</Space>
					</div>
				)}

				<Divider />

				{/* Sample form */}
				<Form
					form={form}
					layout='vertical'
					onFinish={handleSubmit}
					initialValues={{
						size: 100,
						criteria: '',
					}}
				>
					<Form.Item
						name='size'
						label='Veličina uzorka'
						rules={[
							{ required: true, message: 'Molimo unesite veličinu uzorka' },
							{
								type: 'number',
								min: 1,
								message: 'Veličina mora biti veća od 0',
							},
						]}
					>
						<InputNumber
							placeholder='Unesite broj učesnika'
							style={{ width: '100%' }}
							min={1}
							max={10000}
						/>
					</Form.Item>

					<Form.Item
						name='criteria'
						label='Kriterijumi uzorka'
						rules={[
							{ required: true, message: 'Molimo unesite kriterijume' },
							{
								min: 3,
								message: 'Kriterijumi moraju imati najmanje 3 karaktera',
							},
						]}
					>
						<Input.TextArea
							placeholder='Unesite kriterijume za uzorak (npr. "Starost 18-35, region Beograd")'
							rows={3}
							maxLength={500}
							showCount
						/>
					</Form.Item>

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
								loading={createSampleMutation.isPending}
							>
								{createSampleMutation.isPending
									? 'Kreira se...'
									: 'Kreiraj uzorak'}
							</Button>
						</Col>
					</Row>
				</Form>
			</Space>
		</Modal>
	);
};
