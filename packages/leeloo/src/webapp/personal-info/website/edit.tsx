import React, { Ref } from "react";
import { VaultItemType, Website } from "@dashlane/vault-contracts";
import { Lee } from "../../../lee";
import { WebsiteForm, WebsiteFormEditableValues } from "./form";
import { getPersonalInfoEditPanel } from "../generic-edit";
import { IconType } from "../../personal-info-icon";
import { TranslateFunction } from "../../../libs/i18n/types";
const I18N_KEYS = {
  DESCRIPTION: "webapp_personal_info_edition_header_website_description",
  DELETE_TITLE: "webapp_personal_info_edition_delete_title_website",
};
const renderWebsiteForm = (
  lee: Lee,
  item: Website,
  ref: Ref<WebsiteForm>,
  signalEditedValues: () => void
): JSX.Element => {
  const data: WebsiteFormEditableValues = {
    itemName: item.itemName,
    URL: item.URL,
    spaceId: item.spaceId,
  };
  return (
    <WebsiteForm
      lee={lee}
      currentValues={data}
      signalEditedValues={signalEditedValues}
      ref={ref}
    />
  );
};
const getDeleteTitle = (translateFn: TranslateFunction) =>
  translateFn(I18N_KEYS.DELETE_TITLE);
const getTitle = (item: Website): string => item.itemName;
const getDescription = (translateFn: TranslateFunction): string =>
  translateFn(I18N_KEYS.DESCRIPTION);
export const WebsiteEditPanel = getPersonalInfoEditPanel({
  getDeleteTitle,
  getItemTypeDescription: getDescription,
  getTitle,
  iconType: IconType.website,
  vaultItemType: VaultItemType.Website,
  renderForm: renderWebsiteForm,
});
