import { curry, defaultTo } from "ramda";
import {
  Credential,
  CredentialDetailView,
  IconDataStructure,
  LinkedWebsites,
  Space,
} from "@dashlane/communication";
import { SharingStatusDetail } from "Sharing/2/Services/types";
import { dataModelDetailView } from "DataManagement/views";
import { getDomainForCredential } from "DataManagement/Credentials/get-domain-for-credential";
import {
  getDashlaneDefinedLinkedWebsites,
  getUserAddedLinkedWebsiteDomains,
} from "DataManagement/LinkedWebsites";
const defaultToEmptyString = defaultTo("");
const defaultToFalse = defaultTo(false);
export const detailView = curry(
  (
    getSharingStatus: (credentialId: string) => SharingStatusDetail,
    getIcon: (credentialUrl: string) => IconDataStructure | undefined,
    getSmartCategorizedSpaceForCredential: (
      credential: Credential
    ) => Space | null,
    credential: Credential
  ): CredentialDetailView => {
    const sharingStatus = getSharingStatus(credential.Id);
    const domainIcon = getIcon(credential.Url);
    const password = defaultToEmptyString(credential.Password);
    const forceCategorizedSpace =
      getSmartCategorizedSpaceForCredential(credential);
    const linkedWebsites: LinkedWebsites = {
      addedByDashlane: getDashlaneDefinedLinkedWebsites(credential.Url),
      addedByUser: getUserAddedLinkedWebsiteDomains(credential),
    };
    return {
      ...dataModelDetailView(credential),
      autoLogin: credential.AutoLogin || false,
      autoProtected: defaultToFalse(credential.AutoProtected),
      domainIcon,
      email: defaultToEmptyString(credential.Email),
      forceCategorizedSpace,
      linkedWebsites,
      login: defaultToEmptyString(credential.Login),
      note: defaultToEmptyString(credential.Note),
      hasOtp: Boolean(credential.OtpSecret) || Boolean(credential.OtpUrl),
      otpSecret: defaultToEmptyString(credential.OtpSecret),
      otpUrl: defaultToEmptyString(credential.OtpUrl),
      password,
      secondaryLogin: credential.SecondaryLogin,
      sharingStatus,
      strength: credential.Strength || 0,
      subdomainOnly: credential.SubdomainOnly || false,
      title: defaultToEmptyString(
        credential.Title || getDomainForCredential(credential)
      ),
      url: defaultToEmptyString(credential.Url || credential.UserSelectedUrl),
    };
  }
);
