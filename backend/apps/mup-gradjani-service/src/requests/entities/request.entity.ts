import { Appointment } from '../../appointment/entities/appointment.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { Document } from '../../document/entities/document.entity';

export enum RequestType {
  ID_CARD = 'ID_CARD',
  PASSPORT = 'PASSPORT',
  CITIZENSHIP = 'CITIZENSHIP',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
}

export enum RequestStatus {
  CREATED = 'CREATED',
  IN_PROCESS = 'IN_PROCESS',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  COMPLETED = 'COMPLETED',
}

export type Request = {
  id: string;
  caseNumber: string;
  type: RequestType;
  status: RequestStatus;
  submissionDate: string;
  citizenId: string;
  adminMessage?: string;
  processedAt?: string;
  processedBy?: string;
  appointment: Appointment;
  payment: Payment;
  document: Document;
};
