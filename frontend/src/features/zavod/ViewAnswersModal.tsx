import React from 'react';
import {
	Modal,
	Card,
	Typography,
	Spin,
	Space,
	Tag,
	Row,
	Col,
	Divider,
	Empty,
	message,
} from 'antd';
import {
	EyeOutlined,
	UserOutlined,
	CalendarOutlined,
	QuestionCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { surveyApi, type Survey, type Answer } from '../../api/survey.api';

const { Title, Text } = Typography;

interface ViewAnswersModalProps {
	open: boolean;
	onClose: () => void;
	survey: Survey | null;
}


export const ViewAnswersModal: React.FC<ViewAnswersModalProps> = ({
	open,
	onClose,
	survey,
}) => {
	const {
		data: answers,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['survey-answers', survey?.id],
		queryFn: () => surveyApi.getSurveyAnswers(survey!.id),
		enabled: open && !!survey,
		onSuccess: (data) => {
			console.log('🔍 Survey answers data received:', data);
			console.log('📊 Number of answers:', data?.length);
			if (data && data.length > 0) {
				console.log('📝 First answer:', data[0]);
				console.log('📝 First answer value:', data[0].value);
			}
		},
		onError: (error: unknown) => {
			console.error('Error fetching survey answers:', error);
			message.error('Došlo je do greške prilikom učitavanja odgovora');
		},
	});

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('sr-RS', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const getAnswerTypeColor = (type: string) => {
		switch (type) {
			case 'TEXT':
				return 'blue';
			case 'SINGLE_CHOICE':
				return 'green';
			case 'MULTIPLE_CHOICE':
				return 'orange';
			case 'RATING':
				return 'purple';
			default:
				return 'default';
		}
	};

	const getAnswerTypeLabel = (type: string) => {
		switch (type) {
			case 'TEXT':
				return 'Tekstualni odgovor';
			case 'SINGLE_CHOICE':
				return 'Jednostruki izbor';
			case 'MULTIPLE_CHOICE':
				return 'Višestruki izbor';
			case 'RATING':
				return 'Ocena';
			default:
				return type;
		}
	};

	// Group answers by participant
	const answersByParticipant = answers?.reduce((acc, answer) => {
		console.log('🔄 Processing answer:', answer);
		const participantId = answer.participantId.toString();
		console.log('👤 Participant ID:', participantId);
		console.log('💬 Answer value:', answer.value);
		if (!acc[participantId]) {
			acc[participantId] = {
				participant: answer.participant,
				answers: [],
			};
		}
		acc[participantId].answers.push(answer);
		return acc;
	}, {} as Record<string, { participant: any; answers: Answer[] }>) || {};
	
	console.log('📦 Grouped answers by participant:', answersByParticipant);

	const participantCount = Object.keys(answersByParticipant).length;
	const totalAnswers = answers?.length || 0;

	if (!survey) return null;

	return (
		<Modal
			title={
				<Space>
					<EyeOutlined />
					<Title level={4} style={{ margin: 0 }}>
						Odgovori ankete: {survey.title}
					</Title>
				</Space>
			}
			open={open}
			onCancel={onClose}
			footer={null}
			width={1200}
			style={{ top: 20 }}
		>
			{isLoading ? (
				<div style={{ textAlign: 'center', padding: '40px' }}>
					<Spin size="large" />
					<div style={{ marginTop: 16 }}>
						<Text>Učitavanje odgovora...</Text>
					</div>
				</div>
			) : error ? (
				<div style={{ textAlign: 'center', padding: '40px' }}>
					<Empty
						description="Došlo je do greške prilikom učitavanja odgovora"
						image={Empty.PRESENTED_IMAGE_SIMPLE}
					/>
				</div>
			) : !answers || answers.length === 0 ? (
				<div style={{ textAlign: 'center', padding: '40px' }}>
					<Empty
						description="Nema odgovora za ovu anketu"
						image={Empty.PRESENTED_IMAGE_SIMPLE}
					/>
				</div>
			) : (
				<div>
					{/* Statistics */}
					<Card size="small" style={{ marginBottom: 16 }}>
						<Row gutter={16}>
							<Col span={8}>
								<Space direction="vertical" size="small" style={{ width: '100%' }}>
									<Text strong>Ukupno učesnika:</Text>
									<Text style={{ fontSize: '18px', color: '#1890ff' }}>
										{participantCount}
									</Text>
								</Space>
							</Col>
							<Col span={8}>
								<Space direction="vertical" size="small" style={{ width: '100%' }}>
									<Text strong>Ukupno odgovora:</Text>
									<Text style={{ fontSize: '18px', color: '#52c41a' }}>
										{totalAnswers}
									</Text>
								</Space>
							</Col>
							<Col span={8}>
								<Space direction="vertical" size="small" style={{ width: '100%' }}>
									<Text strong>Prosečno po učesniku:</Text>
									<Text style={{ fontSize: '18px', color: '#fa8c16' }}>
										{participantCount > 0
											? (totalAnswers / participantCount).toFixed(1)
											: '0'}
									</Text>
								</Space>
							</Col>
						</Row>
					</Card>

					<Divider />

					{/* Answers grouped by participant */}
					<Space direction="vertical" size="large" style={{ width: '100%' }}>
						{Object.entries(answersByParticipant).map(
							([participantId, { participant, answers: participantAnswers }]) => (
								<Card
									key={participantId}
									title={
										<Space>
											<UserOutlined />
											<Text strong>
												{participant?.contact || `Učesnik #${participantId}`}
											</Text>
											<Tag color={participant?.status === 'answered' ? 'green' : 'orange'}>
												{participant?.status === 'answered' ? 'Završeno' : 'U toku'}
											</Tag>
										</Space>
									}
									size="small"
								>
									<Space
										direction="vertical"
										size="middle"
										style={{ width: '100%' }}
									>
										{participantAnswers.map((answer, index) => (
											<Card
												key={answer.id}
												size="small"
												style={{
													backgroundColor: '#fafafa',
													border: '1px solid #f0f0f0',
												}}
											>
												<Row gutter={16} align="top">
													<Col span={18}>
														<Space direction="vertical" size="small" style={{ width: '100%' }}>
															<Space>
																<QuestionCircleOutlined />
																<Text strong>
																	Pitanje {index + 1}:
																</Text>
																<Tag color={getAnswerTypeColor(answer.question?.type || '')}>
																	{getAnswerTypeLabel(answer.question?.type || '')}
																</Tag>
															</Space>
															<Text style={{ fontSize: '14px', color: '#666' }}>
																{answer.question?.text}
															</Text>
															<div
																style={{
																	padding: '8px 12px',
																	backgroundColor: '#fff',
																	border: '1px solid #d9d9d9',
																	borderRadius: '4px',
																	marginTop: '4px',
																}}
															>
																<Text strong>Odgovor:</Text>
																<br />
																<Text>{(() => {
																	console.log('🎯 Rendering answer:', answer);
																	console.log('🎯 Answer value:', answer.value);
																	return answer.value || 'NEMA ODGOVORA';
																})()}</Text>
															</div>
														</Space>
													</Col>
													<Col span={6}>
														<Space direction="vertical" size="small">
															<Space>
																<CalendarOutlined />
																<Text type="secondary" style={{ fontSize: '12px' }}>
																	{formatDate(answer.createdAt)}
																</Text>
															</Space>
														</Space>
													</Col>
												</Row>
											</Card>
										))}
									</Space>
								</Card>
							)
						)}
					</Space>
				</div>
			)}
		</Modal>
	);
};
