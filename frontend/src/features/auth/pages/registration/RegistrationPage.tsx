import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	Card,
	Form,
	Input,
	Button,
	Typography,
	Space,
	Divider,
	Row,
	Col,
} from 'antd';
import {
	UserOutlined,
	MailOutlined,
	PhoneOutlined,
	LockOutlined,
	IdcardOutlined,
	UserAddOutlined,
} from '@ant-design/icons';
import { Controller } from 'react-hook-form';
import { useRegisterForm } from '../../hooks/useAuthForm';
import { useRegisterMutation } from '../../hooks/useAuthQueries';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import type { RegisterFormData } from '../../schemas/auth.schemas';
import './RegistrationPage.css';

const { Title, Text } = Typography;

export const RegistrationPage: React.FC = () => {
	// Guard to redirect authenticated users
	useAuthGuard(false);

	const navigate = useNavigate();

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useRegisterForm();

	const registerMutation = useRegisterMutation();

	const onSubmit = async (data: RegisterFormData) => {
		try {
			// Remove confirmPassword before sending to API
			const { confirmPassword, ...registerData } = data;
			// Explicitly ignore confirmPassword as it's only for validation
			void confirmPassword;
			await registerMutation.mutateAsync(registerData);
			// Redirect to login page after successful registration
			navigate('/auth/login', { replace: true });
		} catch (error) {
			// Error handling is done in AuthProvider
			console.error('Registration error:', error);
		}
	};

	return (
		<div className='registration-container'>
			<div className='registration-content'>
				<Card
					className='registration-card'
					cover={
						<div className='registration-header'>
							<UserAddOutlined className='registration-icon' />
							<Title level={2} className='registration-title'>
								Registracija
							</Title>
							<Text className='registration-subtitle'>
								Kreirajte nalog na e-Government platformi
							</Text>
						</div>
					}
				>
					<Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
						<Row gutter={16}>
							<Col xs={24} md={12}>
								<Form.Item
									label='JMBG'
									validateStatus={errors.jmbg ? 'error' : ''}
									help={errors.jmbg?.message}
								>
									<Controller
										name='jmbg'
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												size='large'
												prefix={<IdcardOutlined />}
												placeholder='1234567890123'
												maxLength={13}
											/>
										)}
									/>
								</Form.Item>
							</Col>

							<Col xs={24} md={12}>
								<Form.Item
									label='Email adresa'
									validateStatus={errors.email ? 'error' : ''}
									help={errors.email?.message}
								>
									<Controller
										name='email'
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												size='large'
												prefix={<MailOutlined />}
												placeholder='ime@example.com'
												type='email'
											/>
										)}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col xs={24} md={12}>
								<Form.Item
									label='Ime'
									validateStatus={errors.firstName ? 'error' : ''}
									help={errors.firstName?.message}
								>
									<Controller
										name='firstName'
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												size='large'
												prefix={<UserOutlined />}
												placeholder='Marko'
											/>
										)}
									/>
								</Form.Item>
							</Col>

							<Col xs={24} md={12}>
								<Form.Item
									label='Prezime'
									validateStatus={errors.lastName ? 'error' : ''}
									help={errors.lastName?.message}
								>
									<Controller
										name='lastName'
										control={control}
										render={({ field }) => (
											<Input
												{...field}
												size='large'
												prefix={<UserOutlined />}
												placeholder='Petrović'
											/>
										)}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Form.Item
							label='Telefon'
							validateStatus={errors.phone ? 'error' : ''}
							help={errors.phone?.message}
						>
							<Controller
								name='phone'
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										size='large'
										prefix={<PhoneOutlined />}
										placeholder='+38161234567'
									/>
								)}
							/>
						</Form.Item>

						<Row gutter={16}>
							<Col xs={24} md={12}>
								<Form.Item
									label='Lozinka'
									validateStatus={errors.password ? 'error' : ''}
									help={errors.password?.message}
								>
									<Controller
										name='password'
										control={control}
										render={({ field }) => (
											<Input.Password
												{...field}
												size='large'
												prefix={<LockOutlined />}
												placeholder='Minimum 6 karaktera'
											/>
										)}
									/>
								</Form.Item>
							</Col>

							<Col xs={24} md={12}>
								<Form.Item
									label='Potvrdite lozinku'
									validateStatus={errors.confirmPassword ? 'error' : ''}
									help={errors.confirmPassword?.message}
								>
									<Controller
										name='confirmPassword'
										control={control}
										render={({ field }) => (
											<Input.Password
												{...field}
												size='large'
												prefix={<LockOutlined />}
												placeholder='Ponovite lozinku'
											/>
										)}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Form.Item>
							<Button
								type='primary'
								htmlType='submit'
								size='large'
								block
								loading={registerMutation.isPending}
								disabled={!isValid}
								icon={<UserAddOutlined />}
							>
								Registrujte se
							</Button>
						</Form.Item>

						<Divider>ili</Divider>

						<div className='registration-footer'>
							<Space
								direction='vertical'
								size='small'
								style={{ width: '100%' }}
							>
								<Text>
									Već imate nalog?{' '}
									<Link to='/auth/login'>Prijavite se ovde</Link>
								</Text>

								<Text type='secondary' style={{ fontSize: '12px' }}>
									Registracijom se slažete sa uslovima korišćenja platforme.
								</Text>
							</Space>
						</div>
					</Form>
				</Card>
			</div>
		</div>
	);
};
