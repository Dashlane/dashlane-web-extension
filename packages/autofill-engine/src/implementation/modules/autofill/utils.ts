import {
  CredentialAutofillView,
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { VaultAutofillView } from "@dashlane/communication";
import { MatchType } from "@dashlane/hermes";
import { ParsedURL } from "@dashlane/url-parser";
import {
  IngredientAndVaultItem,
  SomeVaultIngredient,
} from "../../../Api/types/autofill";
import {
  parseFieldClassifications,
  parseFormClassifications,
} from "../../../config/helpers/parser";
import {
  FieldExtraLabelsType,
  FieldMainLabelsType,
  FormLabelsType,
} from "../../../config/labels/labels";
import {
  ETLD_WITH_STRICT_FULLDOMAIN_MATCH,
  MAPPED_DOMAINS,
  META_DOMAINS_WITH_STRICT_FULLDOMAIN_MATCH,
} from "./urls-lists";
import { managedStorageGet } from "@dashlane/webextensions-apis";
export const getEmailDomain = (email: string) => {
  return email.split("@").pop() ?? "";
};
const stripTLD = (rootDomain: string) => {
  return rootDomain.split(".").shift() ?? "";
};
export const areWeOnTheUserMailProviderWebsite = (
  email: string,
  domain: string
): boolean => {
  const strippedDomain = stripTLD(domain);
  const domainsToCompareTo = MAPPED_DOMAINS[strippedDomain] ?? [strippedDomain];
  const emailProviderDomain = stripTLD(getEmailDomain(email));
  return domainsToCompareTo.includes(emailProviderDomain);
};
export const isUrlUnsecure = (url: string) => url.startsWith("__REDACTED__");
export const areMainLabelsInFieldClassification = (
  fieldClassification: string,
  searchedLabels: FieldMainLabelsType[]
) =>
  parseFieldClassifications(fieldClassification).some((label) =>
    searchedLabels.some((searchedLabel) => label.main.includes(searchedLabel))
  );
export const isExtraLabelInFieldClassification = (
  fieldClassification: string,
  searchedLabel: FieldExtraLabelsType
) =>
  parseFieldClassifications(fieldClassification).some((label) =>
    label.extra.includes(searchedLabel)
  );
export const isLabelInFormClassification = (
  formClassification: string,
  searchedLabel: FormLabelsType
) => parseFormClassifications(formClassification).includes(searchedLabel);
export const asyncArrayFilterHelper = <T>(
  arr: Array<T>,
  conditionFn: (item: T) => Promise<boolean>
): Promise<T[]> =>
  Promise.all(arr.map(conditionFn)).then((results) =>
    arr.filter((_v, index) => results[index])
  );
export const asyncArraySomeHelper = async <T>(
  arr: Array<T>,
  conditionFn: (item: T) => Promise<boolean>
) => {
  for (const e of arr) {
    if (await conditionFn(e)) {
      return true;
    }
  }
  return false;
};
const getUrlSubstringAfterRootDomain = (url: string, rootDomain: string) =>
  url.substring(url.indexOf(rootDomain) + rootDomain.length);
const doCredentialAndTabUrlPortsMatch = (
  credURL: string,
  credRootDomain: string,
  tabURL: string,
  tabRootDomain: string
) => {
  const portRegex = /^:(\d+)/m;
  const credUrlPort =
    getUrlSubstringAfterRootDomain(credURL, credRootDomain).match(portRegex) ??
    [];
  const tabUrlPort =
    getUrlSubstringAfterRootDomain(tabURL, tabRootDomain).match(portRegex) ??
    [];
  return credUrlPort.length > 0 ? credUrlPort[0] === tabUrlPort[0] : true;
};
const deepCompareUrls = (currentUrl: string, toCompareUrl: string): boolean => {
  const parsedCurrentUrl = new ParsedURL(currentUrl);
  const parsedToCompareUrl = new ParsedURL(toCompareUrl);
  const sameDomains =
    parsedCurrentUrl.getRootDomain() === parsedToCompareUrl.getRootDomain();
  let samePath = true;
  if (
    parsedToCompareUrl.getPathname() &&
    parsedToCompareUrl.getPathname() !== "/"
  ) {
    samePath =
      parsedCurrentUrl.getPathname() === parsedToCompareUrl.getPathname();
  }
  const samePorts = doCredentialAndTabUrlPortsMatch(
    currentUrl,
    parsedCurrentUrl.getRootDomain(),
    toCompareUrl,
    parsedToCompareUrl.getRootDomain()
  );
  return sameDomains && samePath && samePorts;
};
export const isCredentialAllowedOnThisUrl = (
  credItemDetail: CredentialAutofillView,
  tabUrl: string
): boolean => {
  const parsedTabURL = new ParsedURL(tabUrl);
  const tabEtld = parsedTabURL.getETLD();
  const tabRootDomain = parsedTabURL.getRootDomain();
  const credUrl = credItemDetail.url;
  const parsedCredURL = new ParsedURL(credUrl);
  const credRootDomain = parsedCredURL.getRootDomain();
  const credFullDomain = parsedCredURL.getHostname();
  if (
    ETLD_WITH_STRICT_FULLDOMAIN_MATCH.includes(tabEtld) &&
    !(tabEtld === credFullDomain || credRootDomain === tabRootDomain)
  ) {
    return false;
  }
  const pageUrlIsMetaDomain =
    META_DOMAINS_WITH_STRICT_FULLDOMAIN_MATCH.includes(tabRootDomain);
  if (credItemDetail.subdomainOnly || pageUrlIsMetaDomain) {
    return (
      deepCompareUrls(tabUrl, credUrl) ||
      credItemDetail.userAddedLinkedWebsites.some((website) =>
        deepCompareUrls(tabUrl, website)
      )
    );
  }
  if (credItemDetail.matchType === MatchType.UserAssociatedWebsite) {
    return credItemDetail.userAddedLinkedWebsites.some((website) =>
      tabUrl.includes(new ParsedURL(website).getHostname())
    );
  }
  return true;
};
export const isPropertyInVaultItem = (
  property: unknown,
  vaultItem: VaultAutofillView
): property is keyof typeof vaultItem =>
  typeof property === "string" && property in vaultItem;
export const isIngredientValidForCredential = (
  obj: IngredientAndVaultItem
): obj is {
  ingredient: SomeVaultIngredient<VaultSourceType.Credential>;
  vaultItem: VaultAutofillViewInterfaces[VaultSourceType.Credential];
} =>
  obj.ingredient.type === VaultSourceType.Credential &&
  isPropertyInVaultItem(obj.ingredient.property, obj.vaultItem);
export const isIngredientValidForAddress = (
  obj: IngredientAndVaultItem
): obj is {
  ingredient: SomeVaultIngredient<VaultSourceType.Address>;
  vaultItem: VaultAutofillViewInterfaces[VaultSourceType.Address];
} =>
  obj.ingredient.type === VaultSourceType.Address &&
  isPropertyInVaultItem(obj.ingredient.property, obj.vaultItem);
export const getMatchType = (selectedVaultItem: VaultAutofillView): MatchType =>
  selectedVaultItem.vaultType === VaultSourceType.Credential
    ? selectedVaultItem.matchType
    : MatchType.Regular;
export const extractSilentDeploy = async (): Promise<boolean> => {
  const SILENT_DEPLOY = "silent_deploy";
  try {
    const storage = await managedStorageGet();
    return (
      typeof storage === "object" &&
      storage !== null &&
      SILENT_DEPLOY in storage &&
      storage[SILENT_DEPLOY] === true
    );
  } catch {
    return false;
  }
};
