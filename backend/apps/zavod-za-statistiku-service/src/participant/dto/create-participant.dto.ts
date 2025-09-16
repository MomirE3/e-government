import { IsEmail, Matches } from 'class-validator';

export class CreateParticipantDto {
  @IsEmail({}, { message: 'Kontakt mora biti validna email adresa' })
  @Matches(/@gmail\.com$/, { message: 'Dozvoljeni su samo Gmail nalozi' })
  contact: string;
}
