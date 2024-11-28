import React, { memo } from "react";
import { Address } from "@dashlane/vault-contracts";
import { DisplayField } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import SpaceName from "../../../../../components/inputs/common/space-name/space-name";
import { FormContainer } from "../../common/form-container";
import { LinkedPhoneInput } from "./linked-phone-input";
export const I18N_KEYS = {
  STREET_NAME_LABEL:
    "tab/all_items/personal_info/address/detail_view/label/street_name",
  ZIP_CODE_LABEL:
    "tab/all_items/personal_info/address/detail_view/label/zip_code",
  CITY_LABEL: "tab/all_items/personal_info/address/detail_view/label/city",
  COUNTRY_LABEL:
    "tab/all_items/personal_info/address/detail_view/label/country",
  ADDRESS_NAME_LABEL:
    "tab/all_items/personal_info/address/detail_view/label/address_name",
  ADDRESS_SPACE_LABEL:
    "tab/all_items/personal_info/address/detail_view/label/address_space",
  ADDRESS_RECEIVER_LABEL:
    "tab/all_items/personal_info/address/detail_view/label/address_receiver",
  ADDRESS_BUILDING_LABEL:
    "tab/all_items/personal_info/address/detail_view/label/address_building",
  ADDRESS_FLOOR_LABEL:
    "tab/all_items/personal_info/address/detail_view/label/address_floor",
  ADDRESS_DOOR_LABEL:
    "tab/all_items/personal_info/address/detail_view/label/address_door",
  ADDRESS_DIGIT_CODE_LABEL:
    "tab/all_items/personal_info/address/detail_view/label/address_digit_code",
};
interface Props {
  address: Address;
}
const AddressFormComponent = ({ address }: Props) => {
  const { translate } = useTranslate();
  const {
    itemName,
    building,
    city,
    country,
    digitCode,
    door,
    floor,
    linkedPhoneId,
    receiver,
    spaceId,
    streetName,
    zipCode,
  } = address;
  return (
    <FormContainer>
      {streetName && (
        <DisplayField
          id="addressStreetName"
          label={translate(I18N_KEYS.STREET_NAME_LABEL)}
          value={streetName}
        />
      )}
      {zipCode && (
        <DisplayField
          id="addressZipCode"
          label={translate(I18N_KEYS.ZIP_CODE_LABEL)}
          value={zipCode}
        />
      )}
      {city && (
        <DisplayField
          id="addressCity"
          label={translate(I18N_KEYS.CITY_LABEL)}
          value={city}
        />
      )}
      {country && (
        <DisplayField
          id="addressCountry"
          label={translate(I18N_KEYS.COUNTRY_LABEL)}
          value={country}
        />
      )}
      {itemName && (
        <DisplayField
          id="addressAddressName"
          label={translate(I18N_KEYS.ADDRESS_NAME_LABEL)}
          value={itemName}
        />
      )}
      {spaceId && (
        <SpaceName
          id="addressSpace"
          label={translate(I18N_KEYS.ADDRESS_SPACE_LABEL)}
          spaceId={spaceId}
        />
      )}
      {receiver && (
        <DisplayField
          id="addressReceiver"
          label={translate(I18N_KEYS.ADDRESS_RECEIVER_LABEL)}
          value={receiver}
        />
      )}
      {building && (
        <DisplayField
          id="addressBuilding"
          label={translate(I18N_KEYS.ADDRESS_BUILDING_LABEL)}
          value={building}
        />
      )}
      {floor && (
        <DisplayField
          id="addressFloor"
          label={translate(I18N_KEYS.ADDRESS_FLOOR_LABEL)}
          value={floor}
        />
      )}
      {door && (
        <DisplayField
          id="addressDoor"
          label={translate(I18N_KEYS.ADDRESS_DOOR_LABEL)}
          value={door}
        />
      )}
      {digitCode && (
        <DisplayField
          id="addressDigitCode"
          label={translate(I18N_KEYS.ADDRESS_DIGIT_CODE_LABEL)}
          value={digitCode}
        />
      )}
      {linkedPhoneId && <LinkedPhoneInput linkedPhoneId={linkedPhoneId} />}
    </FormContainer>
  );
};
export const AddressDetailForm = memo(AddressFormComponent);
