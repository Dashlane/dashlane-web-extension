import {
  Address,
  AddressFilterField,
  AddressSortField,
  Mappers,
} from "@dashlane/communication";
export type AddressMappers = Mappers<
  Address,
  AddressSortField,
  AddressFilterField
>;
