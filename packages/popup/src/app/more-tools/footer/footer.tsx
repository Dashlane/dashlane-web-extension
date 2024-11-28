import * as React from "react";
import { jsx } from "@dashlane/design-system";
import { useWebAuthnAuthenticationOptedIn } from "../../../libs/hooks/use-webauthn-authentication";
import { FooterButton } from "./footer-button";
import { useCanLockApp } from "../../../libs/hooks/use-can-lock-app";
interface Props {
  onLockSession: () => void;
  onLogOutClick: () => void;
}
const I18N_KEYS = {
  EMAIL_LABEL_TITLE: "footer/email_label",
  LOCK_BUTTON: "footer/button_lock",
  LOGOUT_BUTTON: "footer/button_logout",
};
const FooterElement: React.FunctionComponent<Props> = ({
  onLockSession,
  onLogOutClick,
}: Props) => {
  const hasLockButton = useCanLockApp();
  return (
    <footer
      sx={{
        backgroundColor: "ds.container.agnostic.neutral.quiet",
        width: "100%",
      }}
    >
      <div
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "8px 16px",
          gap: "10px",
        }}
      >
        {hasLockButton && (
          <FooterButton
            iconName="LockOutlined"
            text={I18N_KEYS.LOCK_BUTTON}
            onClick={onLockSession}
          />
        )}
        <FooterButton
          iconName="LogOutOutlined"
          text={I18N_KEYS.LOGOUT_BUTTON}
          onClick={onLogOutClick}
        />
      </div>
    </footer>
  );
};
export const Footer = React.memo(FooterElement);
