export interface Citizen {
  id: string;
  jmbg: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  requests: any[]; // možeš zameniti tipom Request ako ga imaš
  infractions: any[]; // ili Infraction
  address: any;
}
