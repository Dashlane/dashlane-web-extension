import { Country } from "@dashlane/communication";
export enum CountryZone {
  EUROPE,
  SPANISH,
  JAPAN,
  NORTH_AMERICA_AND_ASIA,
}
const europeZoneCountries = new Set([
  Country.AT,
  Country.BE,
  Country.BG,
  Country.HR,
  Country.CY,
  Country.CZ,
  Country.DK,
  Country.EE,
  Country.FI,
  Country.FR,
  Country.DE,
  Country.GR,
  Country.HU,
  Country.IE,
  Country.IT,
  Country.LV,
  Country.LT,
  Country.LU,
  Country.MT,
  Country.NL,
  Country.PL,
  Country.PT,
  Country.RO,
  Country.SK,
  Country.SI,
  Country.ES,
  Country.SE,
]);
const spanishZoneCountries = new Set([
  Country.AR,
  Country.CL,
  Country.CO,
  Country.MX,
  Country.PE,
  Country.PT,
  Country.ES,
]);
const japanZoneCountries = new Set([Country.JP]);
export const getCountryZone = (country: Country): CountryZone => {
  if (europeZoneCountries.has(country)) {
    return CountryZone.EUROPE;
  }
  if (spanishZoneCountries.has(country)) {
    return CountryZone.SPANISH;
  }
  if (japanZoneCountries.has(country)) {
    return CountryZone.JAPAN;
  }
  return CountryZone.NORTH_AMERICA_AND_ASIA;
};
