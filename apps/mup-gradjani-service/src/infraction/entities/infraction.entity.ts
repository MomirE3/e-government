import { InfractionType } from '@prisma/client';

export interface Infraction {
  id: string;
  dateTime: Date;
  municipality: string;
  description: string;
  penaltyPoints: number;
  fine: number;
  type: InfractionType;
}
