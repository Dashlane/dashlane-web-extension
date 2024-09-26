import { Country, Identity } from "@dashlane/communication";
export const ZERO_INDEX_BASED_MONTH_OFFSET = 1;
export const epochToDate = (epoch: number) => new Date(epoch * 1000);
const epochToDateStr = (epoch: number) => {
  const date = epochToDate(epoch);
  return `${date.getUTCFullYear()}-${
    date.getUTCMonth() + 1
  }-${date.getUTCDate()}`;
};
const dateStrToEpoch = (dateStr: string): number => {
  if (!dateStr) {
    return 0;
  }
  const [year, month, day]: number[] = dateStr
    .split(/[-/]/)
    .map((strNb: string) => Number.parseInt(strNb, 10));
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  const epochMilliseconds = date.setUTCFullYear(year, month - 1, day);
  return Math.floor(epochMilliseconds / 1000);
};
export const viewDateToVaultDate = (epoch: number | null): string =>
  epoch === null ? "" : epochToDateStr(epoch);
export const vaultDateToViewDate = (dateStr: string): number | null => {
  if (!dateStr) {
    return null;
  }
  const epoch = dateStrToEpoch(dateStr);
  if (Number.isNaN(epoch)) {
    return null;
  }
  return epoch;
};
export const vaultCountryToViewCountry = (
  vaultCountry: Country | string
): Exclude<Country, Country.NO_TYPE> => {
  const country: Country | undefined = Country[vaultCountry];
  if (country === undefined || country === Country.NO_TYPE) {
    return Country.UNIVERSAL;
  }
  return country;
};
export const viewCountryToVaultCountry = vaultCountryToViewCountry;
export const identityToName = (identity: Identity | undefined) =>
  identity
    ? [
        identity.FirstName,
        identity.MiddleName,
        identity.LastName,
        identity.LastName2,
      ]
        .filter(Boolean)
        .join(" ")
    : "";
