import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const UnauthorizedPage: React.FC = () => {
	const navigate = useNavigate();

	return (
		<Result
			status='403'
			title='403'
			subTitle='Nemate dozvolu za pristup ovoj stranici.'
			extra={
				<Button type='primary' onClick={() => navigate('/dashboard')}>
					Nazad na Dashboard
				</Button>
			}
		/>
	);
};
