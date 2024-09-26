import {
  Mappers,
  Passport,
  PassportFilterField,
  PassportSortField,
} from "@dashlane/communication";
export type PassportMappers = Mappers<
  Passport,
  PassportSortField,
  PassportFilterField
>;
