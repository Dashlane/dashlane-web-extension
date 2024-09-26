import {
  EditSocialSecurityIdRequest,
  SocialSecurityId,
  SocialSecurityIdUpdateModel,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { socialSecurityIdSelector } from "DataManagement/Ids/SocialSecurityIds/selectors";
import { updateIdHandler } from "DataManagement/Ids/handlers/updateIdHandler";
export const handleSocialSecurityIdFields = (
  updateRequest: EditSocialSecurityIdRequest,
  existingSocialSecurityId: SocialSecurityId
) => ({
  SocialSecurityFullname:
    updateRequest.name ?? existingSocialSecurityId.SocialSecurityFullname,
  SocialSecurityNumber:
    updateRequest.idNumber ?? existingSocialSecurityId.SocialSecurityNumber,
  LinkedIdentity:
    updateRequest.name === undefined
      ? existingSocialSecurityId.LinkedIdentity
      : "",
  Attachments:
    updateRequest.attachments === undefined
      ? existingSocialSecurityId.Attachments
      : updateRequest.attachments,
});
export const editSocialSecurityIdHandler = (
  services: CoreServices,
  data: EditSocialSecurityIdRequest
) =>
  updateIdHandler<SocialSecurityId, SocialSecurityIdUpdateModel>(
    services,
    data,
    handleSocialSecurityIdFields,
    socialSecurityIdSelector
  );
