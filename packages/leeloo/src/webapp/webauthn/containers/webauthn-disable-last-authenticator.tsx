import React, { useCallback, useEffect, useState } from "react";
import { removeWebAuthnAuthenticator } from "../services";
import { isMasterPasswordValid } from "../../master-password/services";
import { DisableWebAuthnLastAuthenticatorDialog } from "../components/dialogs/disable-webauthn-last-authenticator-dialog";
import { WebAuthnErrorDialog } from "../components/dialogs/webauthn-error-dialog";
enum DialogShown {
  NONE = "NONE",
  DISABLE = "DISABLE",
  ERROR = "ERROR",
}
interface Props {
  credentialId: string;
  onDialogClose: () => void;
}
export const WebAuthnDisableLastAuthenticator = ({
  credentialId,
  onDialogClose,
}: Props) => {
  const [showWebAuthnDialog, setShowWebAuthnDialog] = useState<DialogShown>(
    DialogShown.NONE
  );
  useEffect(() => {
    setShowWebAuthnDialog(DialogShown.DISABLE);
  }, []);
  const onDismissDialog = useCallback(() => {
    setShowWebAuthnDialog(DialogShown.NONE);
    typeof onDialogClose === "function" && onDialogClose();
  }, [onDialogClose]);
  const onConfirmDisableLastAuthenticator = useCallback(async () => {
    try {
      await removeWebAuthnAuthenticator(credentialId);
    } catch {
      setShowWebAuthnDialog(DialogShown.ERROR);
    }
  }, [credentialId]);
  const Dialog = () => {
    switch (showWebAuthnDialog) {
      case DialogShown.DISABLE:
        return (
          <DisableWebAuthnLastAuthenticatorDialog
            onValidateMasterPassword={isMasterPasswordValid}
            onRemoveAuthenticator={onConfirmDisableLastAuthenticator}
            onDismiss={onDismissDialog}
          />
        );
      case DialogShown.ERROR:
        return <WebAuthnErrorDialog onDone={onDismissDialog} />;
      case DialogShown.NONE:
      default:
        return null;
    }
  };
  return <Dialog />;
};
