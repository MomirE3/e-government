import { z } from 'zod';

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, 'Email je obavezan')
		.email('Neispravna email adresa'),
	password: z
		.string()
		.min(1, 'Lozinka je obavezna')
		.min(6, 'Lozinka mora imati najmanje 6 karaktera'),
});

export const registerSchema = z
	.object({
		jmbg: z
			.string()
			.min(1, 'JMBG je obavezan')
			.length(13, 'JMBG mora imati tačno 13 cifara')
			.regex(/^\d+$/, 'JMBG mora sadržavati samo brojeve'),
		firstName: z
			.string()
			.min(1, 'Ime je obavezno')
			.min(2, 'Ime mora imati najmanje 2 karaktera'),
		lastName: z
			.string()
			.min(1, 'Prezime je obavezno')
			.min(2, 'Prezime mora imati najmanje 2 karaktera'),
		email: z
			.string()
			.min(1, 'Email je obavezan')
			.email('Neispravna email adresa'),
		phone: z
			.string()
			.min(1, 'Telefon je obavezan')
			.regex(/^(\+381|0)[6-9]\d{7,8}$/, 'Neispravna format telefona'),
		password: z
			.string()
			.min(1, 'Lozinka je obavezna')
			.min(6, 'Lozinka mora imati najmanje 6 karaktera'),
		confirmPassword: z.string().min(1, 'Potvrda lozinke je obavezna'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Lozinke se ne poklapaju',
		path: ['confirmPassword'],
	});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
