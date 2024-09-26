import {
  Company,
  CompanyFilterField,
  CompanySortField,
  Mappers,
} from "@dashlane/communication";
export type CompanyMappers = Mappers<
  Company,
  CompanySortField,
  CompanyFilterField
>;
