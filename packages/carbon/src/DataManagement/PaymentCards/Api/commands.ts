import {
  AddPaymentCardRequest,
  DeletePaymentCardRequest,
  DeletePaymentCardResult,
  PaymentCardSaveResult,
  UpdatePaymentCardRequest,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type PaymentCardCommands = {
  addPaymentCard: Command<AddPaymentCardRequest, PaymentCardSaveResult>;
  updatePaymentCard: Command<UpdatePaymentCardRequest, PaymentCardSaveResult>;
  deletePaymentCard: Command<DeletePaymentCardRequest, DeletePaymentCardResult>;
};
