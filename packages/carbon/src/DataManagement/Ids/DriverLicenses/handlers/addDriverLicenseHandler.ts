import {
  AddDriverLicenseRequest,
  DataModelType,
  DriverLicense,
  DriverLicenseUpdateModel,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { viewDateToVaultDate } from "DataManagement/Ids/helpers";
import { addIdHandler } from "DataManagement/Ids/handlers/addIdHandler";
const handleDriverLicenseFields = ({
  expirationDate,
  idNumber,
  issueDate,
  name,
  state,
}: AddDriverLicenseRequest) => ({
  DateOfBirth: "",
  DeliveryDate: viewDateToVaultDate(issueDate),
  ExpireDate: viewDateToVaultDate(expirationDate),
  Fullname: name ?? "",
  LinkedIdentity: "",
  Number: idNumber ?? "",
  kwType: DataModelType.KWDriverLicence,
  State: state ?? "",
  Sex: "",
});
export const addDriverLicenseHandler = (
  services: CoreServices,
  data: AddDriverLicenseRequest
) =>
  addIdHandler<DriverLicense, DriverLicenseUpdateModel>(
    services,
    data,
    handleDriverLicenseFields
  );
