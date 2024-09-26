import {
  Identity,
  IdentityFilterField,
  IdentitySortField,
  Mappers,
} from "@dashlane/communication";
export type IdentityMappers = Mappers<
  Identity,
  IdentitySortField,
  IdentityFilterField
>;
