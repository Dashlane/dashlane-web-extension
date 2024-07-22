import {
  Phone as CarbonPhone,
  PhoneType as CarbonPhoneType,
} from "@dashlane/communication";
import { Phone, PhoneType } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
const PhoneTypeDictionary = {
  [CarbonPhoneType.PHONE_TYPE_ANY]: PhoneType.Any,
  [CarbonPhoneType.PHONE_TYPE_FAX]: PhoneType.Fax,
  [CarbonPhoneType.PHONE_TYPE_LANDLINE]: PhoneType.Landline,
  [CarbonPhoneType.PHONE_TYPE_MOBILE]: PhoneType.Mobile,
  [CarbonPhoneType.PHONE_TYPE_WORK_FAX]: PhoneType.WorkFax,
  [CarbonPhoneType.PHONE_TYPE_WORK_LANDLINE]: PhoneType.WorkLandline,
  [CarbonPhoneType.PHONE_TYPE_WORK_MOBILE]: PhoneType.WorkMobile,
};
export const phoneMapper = (carbonPhone: CarbonPhone): Phone => {
  const { PhoneName, Number, Type, ...rest } = carbonPhone;
  return {
    ...mapKeysToLowercase(rest),
    itemName: PhoneName,
    phoneNumber: Number,
    type: PhoneTypeDictionary[Type],
  };
};
