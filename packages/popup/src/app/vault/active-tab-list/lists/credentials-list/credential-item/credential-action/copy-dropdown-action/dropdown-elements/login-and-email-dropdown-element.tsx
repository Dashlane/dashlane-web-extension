import React from "react";
import { Field } from "@dashlane/hermes";
import { Credential, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../../../../../libs/i18n/useTranslate";
import { CopyDropdownElement } from "../../../../../common";
import { DisabledDropdownElement } from "./disabled-dropdown-element";
const I18N_KEYS = {
  COPY_EMAIL: "tab/all_items/credential/actions/copy_email",
  COPY_INFO: "tab/all_items/credential/actions/copy_info",
  COPY_LOGIN: "tab/all_items/credential/actions/copy_login",
  NO_LOGIN: "tab/all_items/credential/actions/no_login",
  EMAIL_COPIED_TO_CLIPBOARD:
    "tab/all_items/credential/actions/email_copied_to_clipboard",
  LOGIN_COPIED_TO_CLIPBOARD:
    "tab/all_items/credential/actions/login_copied_to_clipboard",
};
interface LoginAndEmailDropdownElementProps {
  credential: Credential;
}
const LoginAndEmailDropdownElement = ({
  credential,
}: LoginAndEmailDropdownElementProps) => {
  const { translate } = useTranslate();
  if (!credential.username && !credential.email) {
    return (
      <DisabledDropdownElement
        dropdownLabel={translate(I18N_KEYS.COPY_INFO)}
        tooltipTitle={translate(I18N_KEYS.NO_LOGIN)}
      />
    );
  }
  return (
    <>
      {credential.email && (
        <CopyDropdownElement
          copyValue={credential.email}
          credentialId={credential.id}
          field={Field.Email}
          I18N_KEY_text={I18N_KEYS.COPY_EMAIL}
          I18N_KEY_notification={I18N_KEYS.EMAIL_COPIED_TO_CLIPBOARD}
          itemType={VaultItemType.Credential}
        />
      )}
      {credential.username && (
        <CopyDropdownElement
          copyValue={credential.username}
          credentialId={credential.id}
          field={Field.Login}
          I18N_KEY_text={I18N_KEYS.COPY_LOGIN}
          I18N_KEY_notification={I18N_KEYS.LOGIN_COPIED_TO_CLIPBOARD}
          itemType={VaultItemType.Credential}
        />
      )}
    </>
  );
};
export default LoginAndEmailDropdownElement;
