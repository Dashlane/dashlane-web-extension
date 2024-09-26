import {
  AddIdCardRequest,
  DataModelType,
  IdCard,
  IdCardUpdateModel,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { viewDateToVaultDate } from "DataManagement/Ids/helpers";
import { addIdHandler } from "DataManagement/Ids/handlers/addIdHandler";
const handleIdCardFields = ({
  expirationDate,
  idNumber,
  issueDate,
  name,
}: AddIdCardRequest) => ({
  DateOfBirth: "",
  DeliveryDate: viewDateToVaultDate(issueDate),
  ExpireDate: viewDateToVaultDate(expirationDate),
  Fullname: name ?? "",
  LinkedIdentity: "",
  Number: idNumber ?? "",
  kwType: DataModelType.KWIDCard,
  Sex: "",
});
export const addIdCardHandler = (
  services: CoreServices,
  data: AddIdCardRequest
) =>
  addIdHandler<IdCard, IdCardUpdateModel>(services, data, handleIdCardFields);
