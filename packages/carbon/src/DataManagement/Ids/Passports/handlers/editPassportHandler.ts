import {
  EditPassportRequest,
  Passport,
  PassportUpdateModel,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { passportSelector } from "DataManagement/Ids/Passports/selectors";
import { viewDateToVaultDate } from "DataManagement/Ids/helpers";
import { updateIdHandler } from "DataManagement/Ids/handlers/updateIdHandler";
export const handlePassportFields = (
  updateRequest: EditPassportRequest,
  existingPassport: Passport
) => ({
  DeliveryDate:
    updateRequest.issueDate === undefined
      ? existingPassport.DeliveryDate
      : viewDateToVaultDate(updateRequest.issueDate),
  ExpireDate:
    updateRequest.expirationDate === undefined
      ? existingPassport.ExpireDate
      : viewDateToVaultDate(updateRequest.expirationDate),
  Fullname: updateRequest.name ?? existingPassport.Fullname,
  Number: updateRequest.idNumber ?? existingPassport.Number,
  DeliveryPlace: updateRequest.deliveryPlace ?? existingPassport.DeliveryPlace,
  LinkedIdentity:
    updateRequest.name === undefined ? existingPassport.LinkedIdentity : "",
  Attachments:
    updateRequest.attachments === undefined
      ? existingPassport.Attachments
      : updateRequest.attachments,
});
export const editPassportHandler = (
  services: CoreServices,
  data: EditPassportRequest
) =>
  updateIdHandler<Passport, PassportUpdateModel>(
    services,
    data,
    handlePassportFields,
    passportSelector
  );
