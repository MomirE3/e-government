import React, { useState } from 'react';
import {
	Modal,
	Form,
	Input,
	Select,
	Button,
	Space,
	Typography,
	Row,
	Col,
	message,
	Divider,
	Card,
} from 'antd';
import {
	PlusOutlined,
	MinusCircleOutlined,
	QuestionCircleOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { surveyApi, type CreateSurveyData } from '../../api/survey.api';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface CreateSurveyModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

interface QuestionForm {
	id: string;
	text: string;
	type: 'TEXT' | 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'RATING';
	options?: string[];
	required: boolean;
}

export const CreateSurveyModal: React.FC<CreateSurveyModalProps> = ({
	open,
	onClose,
	onSuccess,
}) => {
	const [form] = Form.useForm();
	const [questions, setQuestions] = useState<QuestionForm[]>([]);

	// Create survey mutation
	const createSurveyMutation = useMutation({
		mutationFn: (data: CreateSurveyData) => surveyApi.createSurvey(data),
		onSuccess: () => {
			onSuccess();
		},
		onError: (error: unknown) => {
			console.error('Error creating survey:', error);
			message.error(
				(error as { response?: { data?: { message: string } } }).response?.data
					?.message || 'Došlo je do greške prilikom kreiranja ankete'
			);
		},
	});

	const addQuestion = () => {
		const newQuestion: QuestionForm = {
			id: Date.now().toString(),
			text: '',
			type: 'TEXT',
			options: [],
			required: false,
		};
		setQuestions([...questions, newQuestion]);
	};

	const removeQuestion = (questionId: string) => {
		setQuestions(questions.filter((q) => q.id !== questionId));
	};

	const updateQuestion = (
		questionId: string,
		field: keyof QuestionForm,
		value: string | boolean
	) => {
		setQuestions(
			questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q))
		);
	};

	const addOption = (questionId: string) => {
		setQuestions(
			questions.map((q) =>
				q.id === questionId ? { ...q, options: [...(q.options || []), ''] } : q
			)
		);
	};

	const removeOption = (questionId: string, optionIndex: number) => {
		setQuestions(
			questions.map((q) =>
				q.id === questionId
					? {
							...q,
							options: q.options?.filter((_, index) => index !== optionIndex),
					  }
					: q
			)
		);
	};

	const updateOption = (
		questionId: string,
		optionIndex: number,
		value: string
	) => {
		setQuestions(
			questions.map((q) =>
				q.id === questionId
					? {
							...q,
							options: q.options?.map((opt, index) =>
								index === optionIndex ? value : opt
							),
					  }
					: q
			)
		);
	};

	const handleSubmit = async (values: {
		title: string;
		description: string;
		status: 'ACTIVE' | 'INACTIVE';
	}) => {
		try {
			if (questions.length === 0) {
				message.error('Molimo dodajte najmanje jedno pitanje');
				return;
			}

			const surveyData: CreateSurveyData = {
				title: values.title,
				description: values.description,
				status: values.status,
				questions: questions.map((q) => ({
					text: q.text,
					type: q.type,
					options: q.options?.filter((opt) => opt.trim() !== ''),
					required: q.required,
				})),
			};

			createSurveyMutation.mutate(surveyData);
		} catch (error) {
			console.error('Error creating survey:', error);
			message.error('Molimo popunite sva obavezna polja');
		}
	};

	const handleCancel = () => {
		form.resetFields();
		setQuestions([]);
		onClose();
	};

	const questionTypes = [
		{ value: 'TEXT', label: 'Tekstualni odgovor' },
		{ value: 'MULTIPLE_CHOICE', label: 'Višestruki izbor' },
		{ value: 'SINGLE_CHOICE', label: 'Jednostruki izbor' },
		{ value: 'RATING', label: 'Ocena (1-5)' },
	];

	return (
		<Modal
			title={
				<Space>
					<QuestionCircleOutlined />
					<Title level={4} style={{ margin: 0 }}>
						Kreiraj anketu
					</Title>
				</Space>
			}
			open={open}
			onCancel={handleCancel}
			footer={null}
			width={1000}
			style={{ top: 20 }}
		>
			<Form form={form} layout='vertical' onFinish={handleSubmit}>
				{/* Survey Basic Info */}
				<Row gutter={16}>
					<Col span={16}>
						<Form.Item
							name='title'
							label='Naziv ankete'
							rules={[
								{
									required: true,
									message: 'Molimo unesite naziv ankete',
								},
								{
									min: 5,
									message: 'Naziv mora imati najmanje 5 karaktera',
								},
							]}
						>
							<Input placeholder='Unesite naziv ankete' />
						</Form.Item>
					</Col>
					<Col span={8}>
						<Form.Item
							name='status'
							label='Status'
							rules={[
								{
									required: true,
									message: 'Molimo odaberite status',
								},
							]}
							initialValue='ACTIVE'
						>
							<Select>
								<Option value='ACTIVE'>Aktivna</Option>
								<Option value='INACTIVE'>Neaktivna</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					name='description'
					label='Opis ankete'
					rules={[
						{
							required: true,
							message: 'Molimo unesite opis ankete',
						},
						{
							min: 10,
							message: 'Opis mora imati najmanje 10 karaktera',
						},
					]}
				>
					<TextArea
						rows={3}
						placeholder='Unesite opis ankete...'
						maxLength={500}
						showCount
					/>
				</Form.Item>

				<Divider>Pitanja</Divider>

				{/* Questions */}
				<Space direction='vertical' size='middle' style={{ width: '100%' }}>
					{questions.map((question, index) => (
						<Card
							key={question.id}
							size='small'
							title={`Pitanje ${index + 1}`}
							extra={
								<Button
									type='text'
									danger
									icon={<MinusCircleOutlined />}
									onClick={() => removeQuestion(question.id)}
								>
									Ukloni
								</Button>
							}
						>
							<Space
								direction='vertical'
								size='middle'
								style={{ width: '100%' }}
							>
								<Row gutter={16}>
									<Col span={16}>
										<Input
											placeholder='Unesite pitanje'
											value={question.text}
											onChange={(e) =>
												updateQuestion(question.id, 'text', e.target.value)
											}
										/>
									</Col>
									<Col span={8}>
										<Select
											style={{ width: '100%' }}
											value={question.type}
											onChange={(value) =>
												updateQuestion(question.id, 'type', value)
											}
										>
											{questionTypes.map((type) => (
												<Option key={type.value} value={type.value}>
													{type.label}
												</Option>
											))}
										</Select>
									</Col>
								</Row>

								{/* Options for multiple/single choice */}
								{(question.type === 'MULTIPLE_CHOICE' ||
									question.type === 'SINGLE_CHOICE') && (
									<div>
										<Text strong>Opcije:</Text>
										<Space
											direction='vertical'
											size='small'
											style={{ width: '100%', marginTop: 8 }}
										>
											{question.options?.map((option, optionIndex) => (
												<Row key={optionIndex} gutter={8}>
													<Col span={20}>
														<Input
															placeholder={`Opcija ${optionIndex + 1}`}
															value={option}
															onChange={(e) =>
																updateOption(
																	question.id,
																	optionIndex,
																	e.target.value
																)
															}
														/>
													</Col>
													<Col span={4}>
														<Button
															type='text'
															danger
															icon={<MinusCircleOutlined />}
															onClick={() =>
																removeOption(question.id, optionIndex)
															}
														/>
													</Col>
												</Row>
											))}
											<Button
												type='dashed'
												icon={<PlusOutlined />}
												onClick={() => addOption(question.id)}
												style={{ width: '100%' }}
											>
												Dodaj opciju
											</Button>
										</Space>
									</div>
								)}

								{/* Required checkbox */}
								<Row>
									<Col span={24}>
										<label>
											<input
												type='checkbox'
												checked={question.required}
												onChange={(e) =>
													updateQuestion(
														question.id,
														'required',
														e.target.checked
													)
												}
											/>
											<Text style={{ marginLeft: 8 }}>Obavezno pitanje</Text>
										</label>
									</Col>
								</Row>
							</Space>
						</Card>
					))}

					<Button
						type='dashed'
						icon={<PlusOutlined />}
						onClick={addQuestion}
						style={{ width: '100%' }}
					>
						Dodaj pitanje
					</Button>
				</Space>

				{/* Modal Footer */}
				<Row justify='end' style={{ marginTop: 24 }}>
					<Space>
						<Button onClick={handleCancel}>Otkaži</Button>
						<Button
							type='primary'
							htmlType='submit'
							loading={createSurveyMutation.isPending}
						>
							{createSurveyMutation.isPending
								? 'Kreira se...'
								: 'Kreiraj anketu'}
						</Button>
					</Space>
				</Row>
			</Form>
		</Modal>
	);
};
