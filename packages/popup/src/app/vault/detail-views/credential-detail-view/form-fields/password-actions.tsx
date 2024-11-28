import React from "react";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { Permission, sharingItemsApi } from "@dashlane/sharing-contracts";
import { Button } from "@dashlane/design-system";
import { CopyIconButton } from "./copy-icon-button";
import useTranslate from "../../../../../libs/i18n/useTranslate";
export const I18N_KEYS = {
  REVEAL_PASSWORD: "tab/all_items/credential/view/action/reveal_password",
  HIDE_PASSWORD: "tab/all_items/credential/view/action/hide_password",
  COPY_PASSWORD: "tab/all_items/credential/view/action/copy_password",
  REVEAL_LIMITED_PASSWORD:
    "tab/all_items/credential/view/action/reveal_limited_access_password",
  COPY_LIMITED_PASSWORD:
    "tab/all_items/credential/view/action/copy_limited_access_password",
};
interface PasswordActionsProps {
  credentialId: string;
  isPasswordVisible: boolean;
  onShowClick: () => void;
  onHideClick: () => void;
  onCopyClick: () => void;
}
const PasswordActionsComponent: React.FC<PasswordActionsProps> = ({
  credentialId,
  isPasswordVisible,
  onCopyClick,
  onHideClick,
  onShowClick,
}) => {
  const { translate } = useTranslate();
  const { data, status } = useModuleQuery(
    sharingItemsApi,
    "getPermissionForItem",
    {
      itemId: credentialId,
    }
  );
  if (status !== DataStatus.Success) {
    return null;
  }
  const isCredentialLimited = data.permission === Permission.Limited;
  if (isCredentialLimited) {
    return (
      <>
        <Button
          key="copy"
          aria-label={translate(I18N_KEYS.REVEAL_LIMITED_PASSWORD)}
          tooltip={translate(I18N_KEYS.REVEAL_LIMITED_PASSWORD)}
          icon="ActionRevealOutlined"
          disabled
          intensity="supershy"
          layout="iconOnly"
        />
        <CopyIconButton
          copyAction={onCopyClick}
          text={translate(I18N_KEYS.COPY_LIMITED_PASSWORD)}
          disabled={true}
        />
      </>
    );
  }
  return (
    <>
      {!isPasswordVisible ? (
        <Button
          key="copy"
          aria-label={translate(I18N_KEYS.REVEAL_PASSWORD)}
          tooltip={translate(I18N_KEYS.REVEAL_PASSWORD)}
          icon="ActionRevealOutlined"
          intensity="supershy"
          layout="iconOnly"
          onClick={onShowClick}
        />
      ) : (
        <Button
          key="copy"
          aria-label={translate(I18N_KEYS.HIDE_PASSWORD)}
          tooltip={translate(I18N_KEYS.HIDE_PASSWORD)}
          icon="ActionHideOutlined"
          intensity="supershy"
          layout="iconOnly"
          onClick={onHideClick}
        />
      )}
      <CopyIconButton
        copyAction={onCopyClick}
        text={translate(I18N_KEYS.COPY_PASSWORD)}
      />
    </>
  );
};
export const PasswordActions = React.memo(PasswordActionsComponent);
