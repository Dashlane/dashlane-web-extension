import React, { Ref } from "react";
import { Lee } from "../../../lee";
import { Country, VaultItemType } from "@dashlane/vault-contracts";
import { IconType } from "../../personal-info-icon";
import { AddressForm, AddressFormEditableValues } from "./form";
import { getPersonalInfoAddPanel } from "../generic-add";
const renderAddressForm = (
  lee: Lee,
  formRef: Ref<AddressForm>,
  signalEditedValues: () => void,
  currentSpaceId: string
): JSX.Element => {
  const country: Country =
    Country[lee.globalState.locale.country] || Country.US;
  const data: AddressFormEditableValues = {
    building: "",
    city: "",
    digitCode: "",
    door: "",
    floor: "",
    itemName: "",
    linkedPhoneId: "",
    localeFormat: country,
    receiver: "",
    spaceId: currentSpaceId,
    stairs: "",
    state: "",
    stateNumber: "",
    streetName: "",
    streetNumber: "",
    zipCode: "",
  };
  return (
    <AddressForm
      lee={lee}
      currentValues={data}
      signalEditedValues={signalEditedValues}
      ref={formRef}
    />
  );
};
export const AddressAddPanel = getPersonalInfoAddPanel({
  iconType: IconType.address,
  vaultItemType: VaultItemType.Address,
  renderForm: renderAddressForm,
});
