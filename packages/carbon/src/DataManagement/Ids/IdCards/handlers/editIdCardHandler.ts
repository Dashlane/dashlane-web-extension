import {
  EditIdCardRequest,
  IdCard,
  IdCardUpdateModel,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { idCardSelector } from "DataManagement/Ids/IdCards/selectors";
import { viewDateToVaultDate } from "DataManagement/Ids/helpers";
import { updateIdHandler } from "DataManagement/Ids/handlers/updateIdHandler";
export const handleIdCardFields = (
  updateRequest: EditIdCardRequest,
  existingIdCard: IdCard
) => ({
  DeliveryDate:
    updateRequest.issueDate === undefined
      ? existingIdCard.DeliveryDate
      : viewDateToVaultDate(updateRequest.issueDate),
  ExpireDate:
    updateRequest.expirationDate === undefined
      ? existingIdCard.ExpireDate
      : viewDateToVaultDate(updateRequest.expirationDate),
  Fullname: updateRequest.name ?? existingIdCard.Fullname,
  Number: updateRequest.idNumber ?? existingIdCard.Number,
  LinkedIdentity:
    updateRequest.name === undefined ? existingIdCard.LinkedIdentity : "",
  Attachments:
    updateRequest.attachments === undefined
      ? existingIdCard.Attachments
      : updateRequest.attachments,
});
export const editIdCardHandler = (
  services: CoreServices,
  data: EditIdCardRequest
) =>
  updateIdHandler<IdCard, IdCardUpdateModel>(
    services,
    data,
    handleIdCardFields,
    idCardSelector
  );
