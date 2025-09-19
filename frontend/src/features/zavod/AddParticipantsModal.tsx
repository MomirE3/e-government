import React, { useState } from 'react';
import {
	Modal,
	Input,
	Button,
	Space,
	Typography,
	message,
	Row,
	Col,
	Divider,
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { surveyApi } from '../../api/survey.api';

const { Text } = Typography;

interface AddParticipantsModalProps {
	open: boolean;
	onClose: () => void;
	survey: {
		id: string;
		title: string;
		participants?: { id: string; contact: string }[];
	} | null;
	onSuccess: () => void;
}

interface ParticipantForm {
	id: string;
	contact: string;
}

export const AddParticipantsModal: React.FC<AddParticipantsModalProps> = ({
	open,
	onClose,
	survey,
	onSuccess,
}) => {
	const [participants, setParticipants] = useState<ParticipantForm[]>([]);

	// Create participants mutation
	const createParticipantsMutation = useMutation({
		mutationFn: async (participantsData: { contact: string }[]) => {
			const results = [];
			for (const participant of participantsData) {
				const result = await surveyApi.createParticipant(
					survey?.id || '',
					participant
				);
				results.push(result);
			}
			return results;
		},
		onSuccess: () => {
			message.success('Učesnici su uspešno dodati');
			onSuccess();
			onClose();
			setParticipants([]);
		},
		onError: (error: unknown) => {
			console.error('Error creating participants:', error);
			message.error(
				(error as { response?: { data?: { message: string } } }).response?.data
					?.message || 'Došlo je do greške prilikom dodavanja učesnika'
			);
		},
	});

	const addParticipant = () => {
		const newParticipant: ParticipantForm = {
			id: Date.now().toString(),
			contact: '',
		};
		setParticipants([...participants, newParticipant]);
	};

	const removeParticipant = (participantId: string) => {
		setParticipants(participants.filter((p) => p.id !== participantId));
	};

	const updateParticipant = (
		participantId: string,
		field: keyof ParticipantForm,
		value: string
	) => {
		setParticipants(
			participants.map((p) =>
				p.id === participantId ? { ...p, [field]: value } : p
			)
		);
	};

	const handleSubmit = async () => {
		try {
			if (participants.length === 0) {
				message.error('Molimo dodajte najmanje jednog učesnika');
				return;
			}

			// Validate participants
			const invalidParticipants = participants.filter((p) => !p.contact.trim());
			if (invalidParticipants.length > 0) {
				message.error('Molimo unesite kontakt za sve učesnike');
				return;
			}

			const participantsData = participants.map((p) => ({
				contact: p.contact.trim(),
			}));

			createParticipantsMutation.mutate(participantsData);
		} catch (error) {
			console.error('Error adding participants:', error);
			message.error('Molimo popunite sva obavezna polja');
		}
	};

	const handleCancel = () => {
		onClose();
		setParticipants([]);
	};

	return (
		<Modal
			title='Dodaj učesnike'
			open={open}
			onCancel={handleCancel}
			footer={null}
			width={600}
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
							<Text type='secondary'>
								Trenutno učesnika: {survey.participants?.length || 0}
							</Text>
						</Space>
					</div>
				)}

				<Divider />

				{/* Participants list */}
				<div>
					<Space direction='vertical' size='middle' style={{ width: '100%' }}>
						{participants.map((participant, index) => (
							<div
								key={participant.id}
								style={{
									padding: '16px',
									border: '1px solid #d9d9d9',
									borderRadius: '6px',
									backgroundColor: '#fafafa',
								}}
							>
								<Row gutter={16} align='middle'>
									<Col span={2}>
										<Text strong>#{index + 1}</Text>
									</Col>
									<Col span={20}>
										<Input
											placeholder='Unesite kontakt (email ili telefon)'
											value={participant.contact}
											onChange={(e) =>
												updateParticipant(
													participant.id,
													'contact',
													e.target.value
												)
											}
										/>
									</Col>
									<Col span={2}>
										<Button
											type='text'
											danger
											icon={<MinusCircleOutlined />}
											onClick={() => removeParticipant(participant.id)}
										/>
									</Col>
								</Row>
							</div>
						))}

						<Button
							type='dashed'
							icon={<PlusOutlined />}
							onClick={addParticipant}
							style={{ width: '100%' }}
						>
							Dodaj učesnika
						</Button>
					</Space>
				</div>

				<Divider />

				{/* Actions */}
				<Row justify='end' gutter={8}>
					<Col>
						<Button onClick={handleCancel}>Otkaži</Button>
					</Col>
					<Col>
						<Button
							type='primary'
							onClick={handleSubmit}
							loading={createParticipantsMutation.isPending}
							disabled={participants.length === 0}
						>
							{createParticipantsMutation.isPending
								? 'Dodaje se...'
								: 'Dodaj učesnike'}
						</Button>
					</Col>
				</Row>
			</Space>
		</Modal>
	);
};
