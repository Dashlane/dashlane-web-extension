import { curry } from "ramda";
import { Credential } from "@dashlane/communication";
import { CredentialMappers } from "DataManagement/Credentials/types";
import { lastUseMapper } from "DataManagement/PersonalData/mappers";
const titleMapper = curry(
  (displayTitles: Map<string, string>, credential: Credential): string => {
    return displayTitles.get(credential.Id) || "";
  }
);
const hasAttachmentsMapper = (credential: Credential): boolean =>
  !!credential.Attachments && credential.Attachments.length > 0;
const isLimitedMapper = curry(
  (
    limitedSharedItemIds: {
      [id: string]: boolean;
    },
    credential: Credential
  ): boolean => !!limitedSharedItemIds[credential.Id]
);
export const getCredentialMappers = (
  limitedSharedItemIds: {
    [id: string]: boolean;
  },
  displayTitles: Map<string, string>
): CredentialMappers => ({
  hasAttachments: hasAttachmentsMapper,
  id: (c: Credential) => c.Id,
  isLimited: isLimitedMapper(limitedSharedItemIds),
  lastUse: lastUseMapper,
  login: (c: Credential) => c.Login,
  numberUse: (c: Credential) => c.NumberUse,
  spaceId: (c: Credential) => c.SpaceId,
  title: titleMapper(displayTitles),
  email: (c: Credential) => c.Email,
});
