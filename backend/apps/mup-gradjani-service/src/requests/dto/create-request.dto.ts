import { RequestType, RequestStatus } from '../entities/request.entity';
import type { CreateAppointmentDto } from '../../appointment/dto/create-appointment.dto';
import type { CreatePaymentDto } from '../../payment/dto/create-payment.dto';
import type { CreateDocumentDto } from '../../document/dto/create-document.dto';

export type CreateRequestDto = {
  caseNumber: string;
  type: RequestType;
  status: RequestStatus;
  submissionDate: string;
  citizenId: string;
  appointment?: CreateAppointmentDto;
  payment?: CreatePaymentDto;
  document?: CreateDocumentDto;
};
