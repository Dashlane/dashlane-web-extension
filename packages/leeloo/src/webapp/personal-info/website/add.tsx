import React, { Ref } from "react";
import { Lee } from "../../../lee";
import { VaultItemType } from "@dashlane/vault-contracts";
import { WebsiteForm, WebsiteFormEditableValues } from "./form";
import { getPersonalInfoAddPanel } from "../generic-add";
import { IconType } from "../../personal-info-icon";
const renderPersonalWebsiteForm = (
  lee: Lee,
  ref: Ref<WebsiteForm>,
  signalEditedValues: () => void,
  currentSpaceId: string
): JSX.Element => {
  const data: WebsiteFormEditableValues = {
    itemName: "",
    spaceId: currentSpaceId,
    URL: "",
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
export const WebsiteAddPanel = getPersonalInfoAddPanel({
  iconType: IconType.website,
  vaultItemType: VaultItemType.Website,
  renderForm: renderPersonalWebsiteForm,
});
