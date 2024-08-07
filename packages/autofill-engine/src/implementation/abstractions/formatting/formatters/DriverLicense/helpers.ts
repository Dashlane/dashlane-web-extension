import { DriverLicenseAutofillView } from "@dashlane/autofill-contracts";
import { EU_COUNTRIES } from "../Countries/helpers";
const SPECIFIC_DRIVER_LICENSE_BACKGROUNDS = [
  "FR",
  "US-0-AK",
  "US-0-AL",
  "US-0-AR",
  "US-0-AZ",
  "US-0-CA",
  "US-0-CO",
  "US-0-CT",
  "US-0-DE",
  "US-0-FL",
  "US-0-GA",
  "US-0-HI",
  "US-0-IA",
  "US-0-ID",
  "US-0-IL",
  "US-0-IN",
  "US-0-KS",
  "US-0-KY",
  "US-0-LA",
  "US-0-MA",
  "US-0-MD",
  "US-0-ME",
  "US-0-MI",
  "US-0-MN",
  "US-0-MO",
  "US-0-MS",
  "US-0-MT",
  "US-0-NC",
  "US-0-ND",
  "US-0-NE",
  "US-0-NH",
  "US-0-NJ",
  "US-0-NM",
  "US-0-NV",
  "US-0-NY",
  "US-0-OH",
  "US-0-OK",
  "US-0-OR",
  "US-0-PA",
  "US-0-RI",
  "US-0-SC",
  "US-0-SD",
  "US-0-TN",
  "US-0-TX",
  "US-0-UT",
  "US-0-VA",
  "US-0-VT",
  "US-0-WA",
  "US-0-WI",
  "US-0-WV",
  "US-0-WY",
  "US-0-WY",
];
export const getBackgroundNameForDriversLicense = (
  driverLicenseItem: DriverLicenseAutofillView
): string => {
  let backgroundName = "";
  if (SPECIFIC_DRIVER_LICENSE_BACKGROUNDS.includes(driverLicenseItem.country)) {
    backgroundName = driverLicenseItem.country;
  } else if (
    SPECIFIC_DRIVER_LICENSE_BACKGROUNDS.includes(driverLicenseItem.state)
  ) {
    backgroundName = driverLicenseItem.state;
  } else if (EU_COUNTRIES.includes(driverLicenseItem.country)) {
    backgroundName = "eu";
  } else if (driverLicenseItem.country === "US") {
    backgroundName = "US_generic";
  } else {
    backgroundName = "generic";
  }
  return backgroundName;
};
