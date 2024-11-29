import { browser } from "@dashlane/browser-utils";
import { useState } from "react";
import { ProtectedItemsUnlockRequest, UnlockerAction } from "../types";
export const useProtectedItemsUnlockSuccess = ({
  unlockRequest,
  setUnlockRequest,
}: ProtectedItemsUnlockRequest) => {
  const { action, successCallback } = unlockRequest;
  const [verify, setVerify] = useState(false);
  const handleSuccess = () => {
    setVerify(false);
    successCallback?.();
    setUnlockRequest?.(null);
  };
  const onSuccessWithLogs = () => {
    if (action === UnlockerAction.Copy && browser.isSafari()) {
      setVerify(true);
      return;
    }
    handleSuccess();
  };
  return {
    verify,
    handleSuccess,
    onSuccessWithLogs,
  };
};
