import React, { Ref } from "react";
import { Lee } from "../../../lee";
import { EmailType, VaultItemType } from "@dashlane/vault-contracts";
import { EmailForm, EmailFormEditableValues } from "./form";
import { getPersonalInfoAddPanel } from "../generic-add";
import { IconType } from "../../personal-info-icon";
const renderEmailForm = (
  lee: Lee,
  ref: Ref<EmailForm>,
  signalEditedValues: () => void,
  currentSpaceId: string
): JSX.Element => {
  const data: EmailFormEditableValues = {
    emailAddress: "",
    itemName: "",
    spaceId: currentSpaceId,
    type: EmailType.Perso,
  };
  return (
    <EmailForm
      lee={lee}
      currentValues={data}
      signalEditedValues={signalEditedValues}
      ref={ref}
    />
  );
};
export const EmailAddPanel = getPersonalInfoAddPanel({
  iconType: IconType.email,
  vaultItemType: VaultItemType.Email,
  renderForm: renderEmailForm,
});
