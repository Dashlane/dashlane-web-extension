import {
  DriverLicense,
  DriverLicenseFilterField,
  DriverLicenseSortField,
  Mappers,
} from "@dashlane/communication";
export type DriverLicenseMappers = Mappers<
  DriverLicense,
  DriverLicenseSortField,
  DriverLicenseFilterField
>;
