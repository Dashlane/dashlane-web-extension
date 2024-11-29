import { Country } from "@dashlane/communication";
import { CountryZone, getCountryZone } from "../../libs/countryHelper";
export const getIsEurozone = (country: Country) => {
  return getCountryZone(country) === CountryZone.EUROPE;
};
