import React, { Ref } from "react";
import { Lee } from "../../../lee";
import { Country, PhoneType, VaultItemType } from "@dashlane/vault-contracts";
import { PhoneForm, PhoneFormEditableValues } from "./form";
import { getPersonalInfoAddPanel } from "../generic-add";
import { IconType } from "../../personal-info-icon";
const renderPhoneForm = (
  lee: Lee,
  ref: Ref<PhoneForm>,
  signalEditedValues: () => void,
  currentSpaceId: string
): JSX.Element => {
  const localeFormat: Country =
    Country[lee.globalState.locale.country] || Country.US;
  const data: PhoneFormEditableValues = {
    localeFormat,
    phoneNumber: "",
    itemName: "",
    type: PhoneType.Mobile,
    spaceId: currentSpaceId,
  };
  return (
    <PhoneForm
      lee={lee}
      currentValues={data}
      signalEditedValues={signalEditedValues}
      ref={ref}
    />
  );
};
export const PhoneAddPanel = getPersonalInfoAddPanel({
  iconType: IconType.phone,
  vaultItemType: VaultItemType.Phone,
  renderForm: renderPhoneForm,
});
