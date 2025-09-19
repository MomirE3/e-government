export enum InfractionType {
  DRUNK_DRIVING = 'DRUNK_DRIVING',
  SPEEDING = 'SPEEDING',
  RED_LIGHT_VIOLATION = 'RED_LIGHT_VIOLATION',
  NO_SEATBELT = 'NO_SEATBELT',
}

export interface Infraction {
  id: string;
  dateTime: Date;
  municipality: string;
  description: string;
  penaltyPoints: number;
  fine: number;
  type: InfractionType;
}
