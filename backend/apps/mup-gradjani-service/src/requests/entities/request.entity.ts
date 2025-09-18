import { RequestType, RequestStatus } from '@prisma/client';
import { Appointment } from '../../appointment/entities/appointment.entity';

export type Request = {
  id: string;
  caseNumber: string;
  type: RequestType;
  status: RequestStatus;
  submissionDate: string;
  citizenId: string;
  appointment: Appointment;
  payment: any;
  document: any;
};
