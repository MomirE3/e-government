import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { Controller } from 'react-hook-form';
import { useLoginForm } from '../../hooks/useAuthForm';
import { useLoginMutation } from '../../hooks/useAuthQueries';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import type { LoginFormData } from '../../schemas/auth.schemas';
import './LoginPage.css';

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
	// Guard to redirect authenticated users
	useAuthGuard(false);

	const navigate = useNavigate();
	const location = useLocation();
	const from = (location.state as { from?: string })?.from || '/';

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useLoginForm();

	const loginMutation = useLoginMutation();

	const onSubmit = async (data: LoginFormData) => {
		try {
			await loginMutation.mutateAsync(data);
			navigate(from, { replace: true });
		} catch (error) {
			// Error handling is done in AuthProvider
			console.error('Login error:', error);
		}
	};

	return (
		<div className='login-container'>
			<div className='login-content'>
				<Card
					className='login-card'
					cover={
						<div className='login-header'>
							<LoginOutlined className='login-icon' />
							<Title level={2} className='login-title'>
								Prijava
							</Title>
							<Text className='login-subtitle'>
								Prijavite se na e-Government platformu
							</Text>
						</div>
					}
				>
					<Form layout='vertical' onFinish={handleSubmit(onSubmit)}>
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
										prefix={<UserOutlined />}
										placeholder='Unesite vašu email adresu'
										type='email'
									/>
								)}
							/>
						</Form.Item>

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
										placeholder='Unesite vašu lozinku'
									/>
								)}
							/>
						</Form.Item>

						<Form.Item>
							<Button
								type='primary'
								htmlType='submit'
								size='large'
								block
								loading={loginMutation.isPending}
								disabled={!isValid}
								icon={<LoginOutlined />}
							>
								Prijavite se
							</Button>
						</Form.Item>

						<Divider>ili</Divider>

						<div className='login-footer'>
							<Space
								direction='vertical'
								size='small'
								style={{ width: '100%' }}
							>
								<Text>
									Nemate nalog?{' '}
									<Link to='/auth/register'>Registrujte se ovde</Link>
								</Text>

								<Text type='secondary' style={{ fontSize: '12px' }}>
									Zaboravili ste lozinku? Kontaktirajte administratora.
								</Text>
							</Space>
						</div>
					</Form>
				</Card>
			</div>
		</div>
	);
};
