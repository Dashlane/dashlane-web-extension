import React, { Ref } from "react";
import dateFormatter from "date-fns/format";
import {
  Country,
  IdentityTitle,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { Lee } from "../../../lee";
import { IdentityForm, IdentityFormEditableValues } from "./form";
import { getPersonalInfoAddPanel } from "../generic-add";
import { IconType } from "../../personal-info-icon";
const renderIdentityForm = (
  lee: Lee,
  ref: Ref<IdentityForm>,
  signalEditedValues: () => void,
  currentSpaceId: string
): JSX.Element => {
  const localeFormat: Country =
    Country[lee.globalState.locale.country] || Country.US;
  const data: IdentityFormEditableValues = {
    birthDate: dateFormatter(new Date(), "yyyy-MM-dd"),
    birthPlace: "",
    firstName: "",
    lastName2: "",
    lastName: "",
    localeFormat,
    middleName: "",
    pseudo: "",
    spaceId: currentSpaceId,
    title: IdentityTitle.Mr,
  };
  return (
    <IdentityForm
      lee={lee}
      currentValues={data}
      signalEditedValues={signalEditedValues}
      ref={ref}
    />
  );
};
export const IdentityAddPanel = getPersonalInfoAddPanel({
  iconType: IconType.identity,
  vaultItemType: VaultItemType.Identity,
  renderForm: renderIdentityForm,
});
