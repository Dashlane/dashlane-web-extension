import {
  AddPassportRequest,
  DataModelType,
  Passport,
  PassportUpdateModel,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { viewDateToVaultDate } from "DataManagement/Ids/helpers";
import { addIdHandler } from "DataManagement/Ids/handlers/addIdHandler";
const handlePassportFields = ({
  expirationDate,
  idNumber,
  issueDate,
  name,
  deliveryPlace,
}: AddPassportRequest) => ({
  DateOfBirth: "",
  DeliveryDate: viewDateToVaultDate(issueDate),
  ExpireDate: viewDateToVaultDate(expirationDate),
  Fullname: name ?? "",
  LinkedIdentity: "",
  Number: idNumber ?? "",
  kwType: DataModelType.KWPassport,
  DeliveryPlace: deliveryPlace ?? "",
  Sex: "",
});
export const addPassportHandler = (
  services: CoreServices,
  data: AddPassportRequest
) =>
  addIdHandler<Passport, PassportUpdateModel>(
    services,
    data,
    handlePassportFields
  );
