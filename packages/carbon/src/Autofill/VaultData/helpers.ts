import { defaultTo } from "ramda";
import { Country, Credential, Identity } from "@dashlane/communication";
import { MatchType } from "@dashlane/hermes";
import { epochToDate, vaultDateToViewDate } from "DataManagement/Ids/helpers";
import {
  DomainMatchType,
  getCredentialByDomainMatchType,
} from "DataManagement/Credentials/selectors/credentials-by-domain.selector";
export const defaultToEmptyString = defaultTo("");
export const defaultToUS = defaultTo(Country.US);
export const defaultToZero = defaultTo(0);
export const getAgeFromIdentity = (identity: Identity) => {
  const EPOCH_YEAR = new Date(0).getUTCFullYear();
  const birthDate = epochToDate(vaultDateToViewDate(identity.BirthDate));
  const diff = new Date(Date.now() - birthDate.getTime());
  return Math.abs(diff.getUTCFullYear() - EPOCH_YEAR);
};
export const getDomainMatchTypeForHermes = (
  domain: string,
  credential: Credential
): MatchType => {
  const matchType = getCredentialByDomainMatchType(domain, credential);
  switch (matchType) {
    case DomainMatchType.DashlaneDefinedLinkedWebsite:
      return MatchType.AssociatedWebsite;
    case DomainMatchType.UserDefinedLinkedWebsite:
      return MatchType.UserAssociatedWebsite;
    case DomainMatchType.None:
    case DomainMatchType.MainWebsite:
    default:
      return MatchType.Regular;
  }
};
