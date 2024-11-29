import React, { Ref } from "react";
import { Address, Country, VaultItemType } from "@dashlane/vault-contracts";
import { Lee } from "../../../lee";
import { TranslateFunction } from "../../../libs/i18n/types";
import { IconType } from "../../personal-info-icon";
import { AddressForm, AddressFormEditableValues } from "./form";
import { getPersonalInfoEditPanel } from "../generic-edit";
const I18N_KEYS = {
  ITEM_TYPE: "webapp_personal_info_edition_header_address_description",
  DELETE_CONFIRM: "webapp_personal_info_edition_delete_confirm",
  DELETE_DISMISS: "webapp_personal_info_edition_delete_dismiss",
  DELETE_SUBTITLE: "webapp_personal_info_edition_delete_subtitle",
  DELETE_TITLE: "webapp_personal_info_edition_delete_title_address",
};
const renderAddressForm = (
  lee: Lee,
  item: Address,
  ref: Ref<AddressForm>,
  signalEditedValues: () => void
): JSX.Element => {
  const country: Country =
    Country[lee.globalState.locale.country] || Country.US;
  const data: AddressFormEditableValues = {
    ...item,
    localeFormat: item.localeFormat || country,
  };
  return (
    <AddressForm
      lee={lee}
      currentValues={data}
      signalEditedValues={signalEditedValues}
      ref={ref}
    />
  );
};
const getDeleteTitle = (translateFn: TranslateFunction) =>
  translateFn(I18N_KEYS.DELETE_TITLE);
const getTitle = (item: Address): string => item.itemName ?? "";
const getDescription = (translateFn: TranslateFunction): string =>
  translateFn(I18N_KEYS.ITEM_TYPE);
export const AddressEditPanel = getPersonalInfoEditPanel({
  getDeleteTitle,
  getItemTypeDescription: getDescription,
  getTitle,
  iconType: IconType.address,
  vaultItemType: VaultItemType.Address,
  renderForm: renderAddressForm,
});
