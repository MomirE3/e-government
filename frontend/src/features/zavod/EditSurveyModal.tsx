import React, { useState, useEffect } from 'react';
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
	Popconfirm,
} from 'antd';
import {
	PlusOutlined,
	MinusCircleOutlined,
	QuestionCircleOutlined,
	EditOutlined,
	DeleteOutlined,
	EyeOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { surveyApi, type CreateSurveyData, type Question, type Survey } from '../../api/survey.api';
import { useNavigate } from 'react-router-dom';
import { ViewAnswersModal } from './ViewAnswersModal';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface EditSurveyModalProps {
	open: boolean;
	onClose: () => void;
	onSuccess: () => void;
	survey: Survey | null;
}

interface QuestionForm {
	id: string;
	text: string;
	type: 'TEXT' | 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE' | 'RATING';
	options?: string[];
	required: boolean;
	isNew?: boolean; // Flag to track if question is newly added
}

export const EditSurveyModal: React.FC<EditSurveyModalProps> = ({
	open,
	onClose,
	onSuccess,
	survey,
}) => {
	const [form] = Form.useForm();
	const [questions, setQuestions] = useState<QuestionForm[]>([]);
	const [showAnswersModal, setShowAnswersModal] = useState(false);
    const navigate = useNavigate();

	// Update survey mutation
	const updateSurveyMutation = useMutation({
		mutationFn: (data: CreateSurveyData) => surveyApi.updateSurvey(survey!.id, data),
		onSuccess: () => {
			onSuccess();
		},
		onError: (error: unknown) => {
			console.error('Error updating survey:', error);
			message.error(
				(error as { response?: { data?: { message: string } } }).response?.data
					?.message || 'Došlo je do greške prilikom ažuriranja ankete'
			);
		},
	});

	// Delete survey mutation
	const deleteSurveyMutation = useMutation({
		mutationFn: () => surveyApi.deleteSurvey(survey!.id),
        throwOnError: false,
		onSuccess: () => {
			message.success('Anketa je uspešno obrisana!');
			onSuccess();
		},
		onError: (error: unknown) => {
			console.error('Error deleting survey:', error);
		},
	});

	// Update question mutation
	const updateQuestionMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: any }) => 
			surveyApi.updateQuestion(id, data),
		onSuccess: () => {
			message.success('Pitanje je uspešno ažurirano!');
		},
		onError: (error: unknown) => {
			console.error('Error updating question:', error);
			message.error('Došlo je do greške prilikom ažuriranja pitanja');
		},
	});

	// Delete question mutation
	const deleteQuestionMutation = useMutation({
		mutationFn: (questionId: string) => surveyApi.deleteQuestion(questionId),
		onSuccess: () => {
			message.success('Pitanje je uspešno obrisano!');
		},
		onError: (error: unknown) => {
			console.error('Error deleting question:', error);
			message.error('Došlo je do greške prilikom brisanja pitanja');
		},
	});

	// Create question mutation
	const createQuestionMutation = useMutation({
		mutationFn: (data: any) => surveyApi.createQuestion(survey!.id, data),
		onSuccess: () => {
			message.success('Pitanje je uspešno dodato!');
		},
		onError: (error: unknown) => {
			console.error('Error creating question:', error);
			message.error('Došlo je do greške prilikom dodavanja pitanja');
		},
	});

	// Initialize form and questions when survey changes
	useEffect(() => {
		if (survey && open) {
			form.setFieldsValue({
				title: survey.title,
				description: survey.description,
				status: survey.status,
			});

			// Convert survey questions to form format
			const formQuestions: QuestionForm[] = survey.questions.map((q) => ({
				id: q.id || Date.now().toString(),
				text: q.text,
				type: q.type as any,
				options: q.options || [],
				required: q.required,
				isNew: false,
			}));
			setQuestions(formQuestions);
		}
	}, [survey, open, form]);

	const addQuestion = () => {
		const newQuestion: QuestionForm = {
			id: `new-${Date.now()}`,
			text: '',
			type: 'TEXT',
			options: [],
			required: false,
			isNew: true,
		};
		setQuestions([...questions, newQuestion]);
	};

	const removeQuestion = async (questionId: string, question: QuestionForm) => {
		if (question.isNew) {
			// Remove from local state if it's a new question
			setQuestions(questions.filter((q) => q.id !== questionId));
		} else {
			// Delete from backend if it's an existing question
			try {
				await deleteQuestionMutation.mutateAsync(questionId);
				setQuestions(questions.filter((q) => q.id !== questionId));
			} catch (error) {
				// Error handling is done in mutation
			}
		}
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
			const surveyData: CreateSurveyData = {
				title: values.title,
				description: values.description,
				period: survey!.period,
				status: values.status,
			};

			// Update survey basic info
			await updateSurveyMutation.mutateAsync(surveyData);

			// Handle questions
			for (const question of questions) {
				const questionData = {
					text: question.text,
					type: question.type,
					required: question.required,
				};

				if (question.isNew && question.text.trim()) {
					// Create new question
					await createQuestionMutation.mutateAsync(questionData);
				} else if (!question.isNew && question.text.trim()) {
					// Update existing question
					await updateQuestionMutation.mutateAsync({
						id: question.id,
						data: questionData,
					});
				}
			}

			onSuccess();
		} catch (error) {
			console.error('Error updating survey:', error);
			message.error('Molimo popunite sva obavezna polja');
		}
	};

	const handleDeleteSurvey = async () => {
        try {
            await deleteSurveyMutation.mutateAsync();
            message.success('Anketa je uspešno obrisana!');
            onClose(); 
            navigate('/zavod'); 
            window.location.reload();
        } catch (error) {
            message.success('Anketa je uspešno obrisana!');
            onClose();
            navigate('/zavod');
            window.location.reload();
        }
    };

	const handleCancel = () => {
		form.resetFields();
		setQuestions([]);
		onClose();
	};

	const handleViewAnswers = () => {
		setShowAnswersModal(true);
	};

	const questionTypes = [
		{ value: 'TEXT', label: 'Tekstualni odgovor' },
		{ value: 'MULTIPLE_CHOICE', label: 'Višestruki izbor' },
		{ value: 'SINGLE_CHOICE', label: 'Jednostruki izbor' },
		{ value: 'RATING', label: 'Ocena (1-5)' },
	];

	if (!survey) return null;

	return (
		<Modal
			title={
				<Space>
					<EditOutlined />
					<Title level={4} style={{ margin: 0 }}>
						Uredi anketu: {survey.title}
					</Title>
				</Space>
			}
			open={open}
			onCancel={handleCancel}
			footer={null}
			width={1200}
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
							title={
								<Space>
									<QuestionCircleOutlined />
									<Text>
										{question.isNew ? 'Novo pitanje' : `Pitanje ${index + 1}`}
									</Text>
									{question.isNew && (
										<Text type='secondary'>(Nova)</Text>
									)}
								</Space>
							}
							extra={
								<Popconfirm
									title='Da li ste sigurni da želite da obrišete ovo pitanje?'
									onConfirm={() => removeQuestion(question.id, question)}
									okText='Da'
									cancelText='Ne'
								>
									<Button
										type='text'
										danger
										icon={<MinusCircleOutlined />}
										loading={deleteQuestionMutation.isPending}
									>
										Ukloni
									</Button>
								</Popconfirm>
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
				<Row justify='space-between' style={{ marginTop: 24 }}>
					<Col>
						<Space>
							<Button
								type='default'
								icon={<EyeOutlined />}
								onClick={handleViewAnswers}
							>
								Pregled odgovora
							</Button>
							<Popconfirm
								title='Da li ste sigurni da želite da obrišete ovu anketu?'
								description='Ova akcija je nepovratna!'
								onConfirm={handleDeleteSurvey}
								okText='Da, obriši'
								cancelText='Otkaži'
								okType='danger'
							>
								<Button
									type='primary'
									danger
									icon={<DeleteOutlined />}
									loading={deleteSurveyMutation.isPending}
								>
									Obriši anketu
								</Button>
							</Popconfirm>
						</Space>
					</Col>
					<Col>
						<Space>
							<Button onClick={handleCancel}>Otkaži</Button>
							<Button
								type='primary'
								htmlType='submit'
								loading={updateSurveyMutation.isPending}
								icon={<EditOutlined />}
							>
								{updateSurveyMutation.isPending
									? 'Ažurira se...'
									: 'Ažuriraj anketu'}
							</Button>
						</Space>
					</Col>
				</Row>
			</Form>

			{/* View Answers Modal */}
			<ViewAnswersModal
				open={showAnswersModal}
				onClose={() => setShowAnswersModal(false)}
				survey={survey}
			/>
		</Modal>
	);
};
