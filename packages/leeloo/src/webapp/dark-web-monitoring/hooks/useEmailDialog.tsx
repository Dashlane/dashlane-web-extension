import * as React from "react";
import { OptinDataLeaksResultErrorCode } from "@dashlane/password-security-contracts";
export type OptInErrorCode = OptinDataLeaksResultErrorCode | null;
export const useEmailDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [optInError, setOptInError] = React.useState<OptInErrorCode>(null);
  const open = React.useCallback(() => {
    setOptInError(null);
    setIsOpen(true);
  }, [setOptInError]);
  const close = React.useCallback(() => {
    setOptInError(null);
    setIsOpen(false);
  }, [setOptInError]);
  return {
    isOpen,
    open,
    optInError,
    close,
    setOptInError,
  };
};
