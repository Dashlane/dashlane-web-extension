import {
  DriverLicense,
  DriverLicenseUpdateModel,
  EditDriverLicenseRequest,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { driverLicenseSelector } from "DataManagement/Ids/DriverLicenses/selectors";
import { viewDateToVaultDate } from "DataManagement/Ids/helpers";
import { updateIdHandler } from "DataManagement/Ids/handlers/updateIdHandler";
export const handleDriverLicenseFields = (
  updateRequest: EditDriverLicenseRequest,
  existingDriverLicense: DriverLicense
) => ({
  DeliveryDate:
    updateRequest.issueDate === undefined
      ? existingDriverLicense.DeliveryDate
      : viewDateToVaultDate(updateRequest.issueDate),
  ExpireDate:
    updateRequest.expirationDate === undefined
      ? existingDriverLicense.ExpireDate
      : viewDateToVaultDate(updateRequest.expirationDate),
  Fullname: updateRequest.name ?? existingDriverLicense.Fullname,
  Number: updateRequest.idNumber ?? existingDriverLicense.Number,
  State: updateRequest.state ?? existingDriverLicense.State,
  LinkedIdentity:
    updateRequest.name === undefined
      ? existingDriverLicense.LinkedIdentity
      : "",
  Attachments:
    updateRequest.attachments === undefined
      ? existingDriverLicense.Attachments
      : updateRequest.attachments,
});
export const editDriverLicenseHandler = (
  services: CoreServices,
  data: EditDriverLicenseRequest
) =>
  updateIdHandler<DriverLicense, DriverLicenseUpdateModel>(
    services,
    data,
    handleDriverLicenseFields,
    driverLicenseSelector
  );
