import { Address as CarbonAddress } from "@dashlane/communication";
import { Address } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
export const addressMapper = (carbonAddress: CarbonAddress): Address => {
  const {
    AddressName,
    LinkedPhone,
    StreetName,
    AddressFull,
    StateLevel2,
    ...rest
  } = carbonAddress;
  return {
    ...mapKeysToLowercase(rest),
    itemName: AddressName,
    linkedPhoneId: LinkedPhone,
    streetName: StreetName || AddressFull,
  };
};
