import {
  AddSocialSecurityIdRequest,
  DataModelType,
  SocialSecurityId,
  SocialSecurityIdUpdateModel,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { addIdHandler } from "DataManagement/Ids/handlers/addIdHandler";
const handleSocialSecurityIdFields = (data: AddSocialSecurityIdRequest) => ({
  DateOfBirth: "",
  LinkedIdentity: "",
  SocialSecurityFullname: data.name ?? "",
  SocialSecurityNumber: data.idNumber ?? "",
  kwType: DataModelType.KWSocialSecurityStatement,
  Sex: "",
});
export const addSocialSecurityIdHandler = (
  services: CoreServices,
  data: AddSocialSecurityIdRequest
) =>
  addIdHandler<SocialSecurityId, SocialSecurityIdUpdateModel>(
    services,
    data,
    handleSocialSecurityIdFields
  );
