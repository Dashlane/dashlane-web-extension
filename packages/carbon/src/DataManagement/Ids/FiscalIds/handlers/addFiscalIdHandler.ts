import {
  AddFiscalIdRequest,
  DataModelType,
  FiscalId,
  FiscalIdUpdateModel,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { addIdHandler } from "DataManagement/Ids/handlers/addIdHandler";
const handleFiscalIdFields = ({
  idNumber,
  teledeclarantNumber,
}: AddFiscalIdRequest) => ({
  FiscalNumber: idNumber ?? "",
  kwType: DataModelType.KWFiscalStatement,
  TeledeclarantNumber: teledeclarantNumber ?? "",
});
export const addFiscalIdHandler = (
  services: CoreServices,
  data: AddFiscalIdRequest
) =>
  addIdHandler<FiscalId, FiscalIdUpdateModel>(
    services,
    data,
    handleFiscalIdFields
  );
