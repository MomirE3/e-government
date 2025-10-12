import React, { useState } from 'react';
import {
	Modal,
	Input,
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
import { surveyApi, type Question } from '../../api/survey.api';

const { Title, Text } = Typography;

interface AddQuestionsModalProps {
	open: boolean;
	onClose: () => void;
	survey: {
		id: string;
		title: string;
		questions: Question[];
	} | null;
	onSuccess: () => void;
}

interface QuestionForm {
	id: string;
	text: string;
	required: boolean;
}

export const AddQuestionsModal: React.FC<AddQuestionsModalProps> = ({
	open,
	onClose,
	survey,
	onSuccess,
}) => {
	const [questions, setQuestions] = useState<QuestionForm[]>([]);

	// Create questions mutation
	const createQuestionsMutation = useMutation({
		mutationFn: async (
			questionsData: { text: string; type: string; required: boolean }[]
		) => {
			const results = [];
			for (const question of questionsData) {
				const result = await surveyApi.createQuestion(
					survey?.id || '',
					question
				);
				results.push(result);
			}
			return results;
		},
		onSuccess: () => {
			onSuccess();
		},
		onError: (error: unknown) => {
			console.error('Error creating questions:', error);
			message.error(
				(error as { response?: { data?: { message: string } } }).response?.data
					?.message || 'Došlo je do greške prilikom dodavanja pitanja'
			);
		},
	});

	const addQuestion = () => {
		const newQuestion: QuestionForm = {
			id: Date.now().toString(),
			text: '',
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

	const handleSubmit = async () => {
		try {
			if (questions.length === 0) {
				message.error('Molimo dodajte najmanje jedno pitanje');
				return;
			}

			// Validate all questions
			const invalidQuestions = questions.filter((q) => !q.text.trim());
			if (invalidQuestions.length > 0) {
				message.error('Molimo unesite tekst za sva pitanja');
				return;
			}

			const questionsData = questions.map((q) => ({
				text: q.text,
				type: 'TEXT', // Default type
				required: q.required,
			}));

			createQuestionsMutation.mutate(questionsData);
		} catch (error) {
			console.error('Error adding questions:', error);
			message.error('Molimo popunite sva obavezna polja');
		}
	};

	const handleCancel = () => {
		setQuestions([]);
		onClose();
	};

	return (
		<Modal
			title={
				<Space>
					<QuestionCircleOutlined />
					<Title level={4} style={{ margin: 0 }}>
						Dodaj pitanja
					</Title>
					{survey && <Text type='secondary'>za anketu "{survey.title}"</Text>}
				</Space>
			}
			open={open}
			onCancel={handleCancel}
			footer={null}
			width={1000}
			style={{ top: 20 }}
		>
			{/* Survey Info */}
			{survey && (
				<Card size='small' style={{ marginBottom: 16 }}>
					<Space direction='vertical' size='small'>
						<Text strong>Anketa:</Text>
						<Text>{survey.title}</Text>
						<Space direction='vertical' size='small' style={{ width: '100%' }}>
							<Text strong>Trenutna pitanja:</Text>
							{survey.questions && survey.questions.length > 0 ? (
								<div style={{ maxHeight: '200px', overflowY: 'auto', padding: '8px', backgroundColor: '#fafafa', borderRadius: '4px' }}>
									{survey.questions.map((question, index) => (
										<div key={question.id || index} style={{ marginBottom: '8px', padding: '4px 0', borderBottom: index < survey.questions!.length - 1 ? '1px solid #f0f0f0' : 'none' }}>
											<Text style={{ fontSize: '13px', lineHeight: '1.4' }}>
												<strong>{index + 1}.</strong> {question.text}
											</Text>
										</div>
									))}
								</div>
							) : (
								<Text type='secondary' italic>Nema pitanja u anketi</Text>
							)}
						</Space>
					</Space>
				</Card>
			)}

			<Divider>Nova pitanja</Divider>

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
						<Space direction='vertical' size='middle' style={{ width: '100%' }}>
							<Row gutter={16}>
								<Col span={24}>
									<Input
										placeholder='Unesite pitanje'
										value={question.text}
										onChange={(e) =>
											updateQuestion(question.id, 'text', e.target.value)
										}
									/>
								</Col>
							</Row>

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
						onClick={handleSubmit}
						loading={createQuestionsMutation.isPending}
					>
						{createQuestionsMutation.isPending
							? 'Dodaje se...'
							: 'Dodaj pitanja'}
					</Button>
				</Space>
			</Row>
		</Modal>
	);
};
