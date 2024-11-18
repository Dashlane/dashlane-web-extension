import { Credential as CarbonCredential } from "@dashlane/communication";
import { Credential } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
export const credentialMapper = (
  carbonCredential: CarbonCredential
): Credential => {
  const {
    CreationDatetime,
    Email,
    Id,
    LastBackupTime,
    LastUse,
    LinkedServices,
    Login,
    Note,
    OtpSecret,
    OtpUrl,
    Password,
    SecondaryLogin,
    SpaceId,
    Title,
    Url,
    UserModificationDatetime,
    UserSelectedUrl,
    kwType,
  } = carbonCredential;
  return {
    ...mapKeysToLowercase({
      CreationDatetime,
      Email,
      Id,
      LastBackupTime,
      LastUse,
      Note,
      Password,
      SpaceId,
      UserModificationDatetime,
    }),
    alternativeUsername: SecondaryLogin,
    itemName: Title ?? "",
    linkedURLs:
      LinkedServices?.associated_domains.map(
        (linkedWebsite) => linkedWebsite.domain
      ) ?? [],
    kwType,
    otpURL: OtpUrl,
    otpSecret: OtpSecret,
    URL: Url || UserSelectedUrl || "",
    username: Login,
  };
};
