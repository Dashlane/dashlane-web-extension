import {
  EditFiscalIdRequest,
  FiscalId,
  FiscalIdUpdateModel,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { fiscalIdSelector } from "DataManagement/Ids/FiscalIds/selectors";
import { updateIdHandler } from "DataManagement/Ids/handlers/updateIdHandler";
export const handleFiscalIdFields = (
  updateRequest: EditFiscalIdRequest,
  existingFiscalId: FiscalId
) => ({
  FiscalNumber: updateRequest.idNumber ?? existingFiscalId.FiscalNumber,
  TeledeclarantNumber:
    updateRequest.teledeclarantNumber ?? existingFiscalId.TeledeclarantNumber,
  Attachments:
    updateRequest.attachments === undefined
      ? existingFiscalId.Attachments
      : updateRequest.attachments,
});
export const editFiscalIdHandler = (
  services: CoreServices,
  data: EditFiscalIdRequest
) =>
  updateIdHandler<FiscalId, FiscalIdUpdateModel>(
    services,
    data,
    handleFiscalIdFields,
    fiscalIdSelector
  );
