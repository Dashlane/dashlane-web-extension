import { Credential } from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
export const getDomainForCredential = (
  credential: Credential
): string | null => {
  return new ParsedURL(credential.Url).getRootDomain();
};
