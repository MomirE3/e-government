// Definiši enum lokalno da izbegneš dependency na @prisma/client u gateway build-u
export enum InfractionType {
  DRUNK_DRIVING = 'DRUNK_DRIVING',
  SPEEDING = 'SPEEDING',
  RED_LIGHT_VIOLATION = 'RED_LIGHT_VIOLATION',
  NO_SEATBELT = 'NO_SEATBELT',
}

export type CreateInfractionDto = {
  dateTime: string;
  municipality: string;
  description: string;
  penaltyPoints: number;
  fine: number;
  type: InfractionType;
  citizenId: string;
};
