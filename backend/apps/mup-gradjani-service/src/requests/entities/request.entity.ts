import { RequestType, RequestStatus } from '@prisma/client';
import { Appointment } from '../../appointment/entities/appointment.entity';
import { Payment } from '../../payment/entities/payment.entity';

export type Request = {
  id: string;
  caseNumber: string;
  type: RequestType;
  status: RequestStatus;
  submissionDate: string;
  citizenId: string;
  appointment: Appointment;
  payment: Payment;
  document: any;
};
