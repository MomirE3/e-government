import { InfractionType } from '@prisma/client';

export type CreateInfractionDto = {
  dateTime: string;
  municipality: string;
  description: string;
  penaltyPoints: number;
  fine: number;
  type: InfractionType;
  citizenId: string;
};
