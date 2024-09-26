import * as sharedbackenddomains from "@dashlane/linkeddomains/sharedbackenddomains.json";
import * as ssodomains from "@dashlane/linkeddomains/ssodomains.json";
import * as redirecteddomains from "@dashlane/linkeddomains/redirecteddomains.json";
import { Credential } from "@dashlane/communication";
import { ParsedURL } from "@dashlane/url-parser";
import { DashlaneDefinedLinkedWebsites } from "DataManagement/LinkedWebsites/types";
export function fromObjectToArray(
  list: DashlaneDefinedLinkedWebsites
): string[][] {
  const returnArray: string[][] = [];
  Object.keys(list).forEach((element) => {
    returnArray.push([element].concat(list[element]));
  });
  return returnArray;
}
const intersect = (left: string[], right: string[]): boolean =>
  left.some((elt) => right.includes(elt));
const mergeLinkedDomainsIntoList = (
  domainsLists: string[][],
  domains: string[]
): string[][] => {
  const intersecting: string[][] = [];
  const notIntersecting: string[][] = [];
  domainsLists.forEach((elt) =>
    intersect(elt, domains) ? intersecting.push(elt) : notIntersecting.push(elt)
  );
  const mergedItem = intersecting.concat([domains]).flat();
  return notIntersecting.concat([mergedItem]);
};
export const reduceLinkedDomainsLists = (
  first: string[][],
  second: string[][],
  third: string[][]
): string[][] =>
  first
    .concat(second, third)
    .reduce(mergeLinkedDomainsIntoList, [] as string[][]);
export function populateDashlaneDefinedLinkedWebsitesIndex(
  concat: string[][]
): DashlaneDefinedLinkedWebsites {
  const index = {};
  concat.forEach((subArray) => {
    subArray.forEach((elt) => {
      index[elt] = subArray;
    });
  });
  return index;
}
const allDashlaneDefinedLinkedWebsitesIndex =
  populateDashlaneDefinedLinkedWebsitesIndex(
    reduceLinkedDomainsLists(
      sharedbackenddomains,
      fromObjectToArray(redirecteddomains),
      fromObjectToArray(ssodomains)
    ).map((elt) => [...new Set(elt)])
  );
export function getDashlaneDefinedLinkedWebsites(url: string): string[] {
  const rootDomain = new ParsedURL(url).getRootDomain();
  if (!rootDomain) {
    return [];
  }
  return allDashlaneDefinedLinkedWebsitesIndex[rootDomain] || [rootDomain];
}
export const getUserAddedLinkedWebsiteDomains = (
  credential: Credential
): string[] =>
  (credential.LinkedServices?.associated_domains ?? [])
    .map((item) => item.domain)
    .filter(Boolean) ?? [];
export const getUserAddedLinkedWebsitesRootDomains = (
  credential: Credential
): string[] => {
  const userAddedLinkedWebsites = getUserAddedLinkedWebsiteDomains(credential);
  return userAddedLinkedWebsites.map((linkedWebsite) => {
    return new ParsedURL(linkedWebsite).getRootDomain();
  });
};
