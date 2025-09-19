import React from 'react';
import {
	Card,
	Form,
	Input,
	Button,
	Space,
	Typography,
	Row,
	Col,
	message,
	Divider,
	Select,
	Spin,
} from 'antd';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../auth';
import { citizenApi, type UpdateCitizenData } from '../../api/citizen.api';

const { Title, Text } = Typography;
const { Option } = Select;

interface FormValues {
	jmbg: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	street: string;
	number: string;
	city: string;
	postalCode: string;
	country: string;
}

export const Profile: React.FC = () => {
	const { user } = useAuth();
	const [form] = Form.useForm();

	// Fetch citizen data
	const {
		data: citizenData,
		isLoading: isLoadingCitizen,
		refetch: refetchCitizen,
	} = useQuery({
		queryKey: ['citizen', user?.id],
		queryFn: () => citizenApi.getCitizen(user?.id || ''),
		enabled: !!user?.id,
	});

	// Update citizen mutation
	const updateCitizenMutation = useMutation({
		mutationFn: (data: UpdateCitizenData) =>
			citizenApi.updateCitizen(data.id, data),
		onSuccess: () => {
			message.success('Profil je uspešno ažuriran!');
			refetchCitizen();
		},
		onError: (error: unknown) => {
			console.error('Error updating profile:', error);
			message.error(
				(error as { response?: { data?: { message: string } } }).response?.data
					?.message || 'Došlo je do greške prilikom ažuriranja profila'
			);
		},
	});

	const handleSubmit = async (values: FormValues) => {
		try {
			console.log('Form values:', values);
			console.log('Number field value:', values.number);

			const updateData: UpdateCitizenData = {
				id: user?.id || '',
				jmbg: values.jmbg,
				firstName: values.firstName,
				lastName: values.lastName,
				email: values.email,
				phone: values.phone,
				address: {
					id: citizenData?.address?.id || '', // Include existing address ID if it exists
					street: values.street,
					number: values.number || '',
					city: values.city,
					postalCode: values.postalCode,
					country: values.country,
					validFrom: new Date().toISOString(),
				},
			};

			console.log('Sending update data:', updateData);
			updateCitizenMutation.mutate(updateData);
		} catch (error) {
			console.error('Error updating profile:', error);
			message.error('Molimo popunite sva obavezna polja');
		}
	};

	// Set form values when citizen data is loaded
	React.useEffect(() => {
		if (citizenData) {
			console.log('Citizen data loaded:', citizenData);
			console.log('Address data:', citizenData.address);
			form.setFieldsValue({
				jmbg: citizenData.jmbg,
				firstName: citizenData.firstName,
				lastName: citizenData.lastName,
				email: citizenData.email,
				phone: citizenData.phone,
				street: citizenData.address?.street || '',
				number: citizenData.address?.number || '',
				city: citizenData.address?.city || '',
				postalCode: citizenData.address?.postalCode || '',
				country: citizenData.address?.country || '',
			});
		}
	}, [citizenData, form]);

	const countries = [
		{ value: 'Serbia', label: 'Srbija' },
		{ value: 'Montenegro', label: 'Crna Gora' },
		{ value: 'Bosnia and Herzegovina', label: 'Bosna i Hercegovina' },
		{ value: 'Croatia', label: 'Hrvatska' },
		{ value: 'Slovenia', label: 'Slovenija' },
		{ value: 'North Macedonia', label: 'Severna Makedonija' },
	];

	if (isLoadingCitizen) {
		return (
			<div style={{ padding: '24px', textAlign: 'center' }}>
				<Spin size='large' tip='Učitavanje profila...' />
			</div>
		);
	}

	return (
		<div style={{ padding: '24px' }}>
			<Space direction='vertical' size='large' style={{ width: '100%' }}>
				<div>
					<Title level={2}>Moj profil</Title>
					<Text type='secondary'>
						Upravljajte vašim ličnim podacima i adresom
					</Text>
				</div>

				<Card>
					<Form form={form} layout='vertical' onFinish={handleSubmit}>
						{/* Personal Information */}
						<Title level={4}>Lični podaci</Title>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='firstName'
									label='Ime'
									rules={[
										{
											required: true,
											message: 'Molimo unesite ime',
										},
										{
											min: 2,
											message: 'Ime mora imati najmanje 2 karaktera',
										},
									]}
								>
									<Input placeholder='Unesite ime' />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='lastName'
									label='Prezime'
									rules={[
										{
											required: true,
											message: 'Molimo unesite prezime',
										},
										{
											min: 2,
											message: 'Prezime mora imati najmanje 2 karaktera',
										},
									]}
								>
									<Input placeholder='Unesite prezime' />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='jmbg'
									label='JMBG'
									rules={[
										{
											required: true,
											message: 'Molimo unesite JMBG',
										},
										{
											len: 13,
											message: 'JMBG mora imati tačno 13 cifara',
										},
										{
											pattern: /^[0-9]+$/,
											message: 'JMBG može sadržavati samo cifre',
										},
									]}
								>
									<Input placeholder='Unesite JMBG' maxLength={13} />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='phone'
									label='Telefon'
									rules={[
										{
											required: true,
											message: 'Molimo unesite broj telefona',
										},
										{
											pattern: /^[0-9+\-\s()]+$/,
											message: 'Unesite validan broj telefona',
										},
									]}
								>
									<Input placeholder='Unesite broj telefona' />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={24}>
								<Form.Item
									name='email'
									label='Email'
									rules={[
										{
											required: true,
											message: 'Molimo unesite email',
										},
										{
											type: 'email',
											message: 'Unesite validan email',
										},
									]}
								>
									<Input placeholder='Unesite email adresu' />
								</Form.Item>
							</Col>
						</Row>

						<Divider />

						{/* Address Information */}
						<Title level={4}>Adresa</Title>
						<Row gutter={16}>
							<Col span={16}>
								<Form.Item
									name='street'
									label='Ulica'
									rules={[
										{
											required: true,
											message: 'Molimo unesite ulicu',
										},
									]}
								>
									<Input placeholder='Unesite ulicu' />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item
									name='number'
									label='Broj'
									rules={[
										{
											required: true,
											message: 'Molimo unesite broj',
										},
									]}
								>
									<Input placeholder='Unesite broj' />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									name='city'
									label='Grad'
									rules={[
										{
											required: true,
											message: 'Molimo unesite grad',
										},
									]}
								>
									<Input placeholder='Unesite grad' />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item
									name='postalCode'
									label='Poštanski broj'
									rules={[
										{
											required: true,
											message: 'Molimo unesite poštanski broj',
										},
										{
											pattern: /^[0-9]+$/,
											message: 'Poštanski broj može sadržavati samo cifre',
										},
									]}
								>
									<Input placeholder='Unesite poštanski broj' />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={24}>
								<Form.Item
									name='country'
									label='Država'
									rules={[
										{
											required: true,
											message: 'Molimo odaberite državu',
										},
									]}
								>
									<Select placeholder='Odaberite državu'>
										{countries.map((country) => (
											<Option key={country.value} value={country.value}>
												{country.label}
											</Option>
										))}
									</Select>
								</Form.Item>
							</Col>
						</Row>

						{/* Submit Button */}
						<Row justify='end' style={{ marginTop: '24px' }}>
							<Button
								type='primary'
								htmlType='submit'
								size='large'
								loading={updateCitizenMutation.isPending}
							>
								{updateCitizenMutation.isPending
									? 'Čuva se...'
									: 'Sačuvaj promene'}
							</Button>
						</Row>
					</Form>
				</Card>
			</Space>
		</div>
	);
};
