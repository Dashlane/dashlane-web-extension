import React, { useCallback, useEffect, useState } from "react";
import type { InitEnableWebAuthnAuthenticationResult } from "@dashlane/communication";
import {
  enableWebAuthnAuthentication,
  initEnableWebAuthnAuthentication,
} from "../services";
import { useHasWebAuthnPlatformAuthenticator } from "../hooks";
import { EnableWebAuthnDialog } from "../components/dialogs/enable-webauthn-dialog";
import { ConfirmEnableWebAuthnDialog } from "../components/dialogs/confirm-enable-webauthn-dialog";
import { WebAuthnErrorDialog } from "../components/dialogs/webauthn-error-dialog";
enum DialogShown {
  NONE = "NONE",
  ENABLE = "ENABLE",
  CONFIRM_ENABLE = "CONFIRM_ENABLE",
  ERROR = "ERROR",
}
interface Props {
  onDialogClose: () => void;
}
export const WebAuthnEnabler = ({ onDialogClose }: Props) => {
  const [initEnableResult, setInitEnableResult] = useState<
    InitEnableWebAuthnAuthenticationResult | undefined
  >();
  const [showWebAuthnDialog, setShowWebAuthnDialog] = useState<DialogShown>(
    DialogShown.NONE
  );
  const userHasWebAuthnPlatformAuthenticator =
    useHasWebAuthnPlatformAuthenticator();
  useEffect(() => {
    const initialization = async () => {
      try {
        const initEnable = await initEnableWebAuthnAuthentication();
        setInitEnableResult(initEnable);
        setShowWebAuthnDialog(DialogShown.ENABLE);
      } catch {
        setShowWebAuthnDialog(DialogShown.ERROR);
      }
    };
    initialization();
  }, []);
  const onDismissDialog = useCallback(() => {
    setShowWebAuthnDialog(DialogShown.NONE);
    typeof onDialogClose === "function" && onDialogClose();
  }, [onDialogClose]);
  const onConfirmEnableWebAuthnDialog = useCallback(async () => {
    try {
      await enableWebAuthnAuthentication(initEnableResult);
      setInitEnableResult(undefined);
      setShowWebAuthnDialog(DialogShown.CONFIRM_ENABLE);
    } catch {
      setShowWebAuthnDialog(DialogShown.ERROR);
    }
  }, [initEnableResult]);
  const Dialog = () => {
    switch (showWebAuthnDialog) {
      case DialogShown.ENABLE:
        return (
          <EnableWebAuthnDialog
            userHasWebAuthnPlatformAuthenticator={
              userHasWebAuthnPlatformAuthenticator
            }
            onAddAuthenticator={onConfirmEnableWebAuthnDialog}
            onDismiss={onDismissDialog}
          />
        );
      case DialogShown.CONFIRM_ENABLE:
        return (
          <ConfirmEnableWebAuthnDialog
            onDone={onDismissDialog}
            userHasWebAuthnPlatformAuthenticator={
              userHasWebAuthnPlatformAuthenticator
            }
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
