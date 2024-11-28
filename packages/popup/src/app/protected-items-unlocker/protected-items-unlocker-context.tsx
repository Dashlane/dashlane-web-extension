import * as React from "react";
import MasterPasswordDialog, {
  ConfirmLabelMode,
} from "./master-password-dialog";
import {
  useAreProtectedItemsUnlocked,
  useProtectPasswordsSetting,
} from "../../libs/api";
import { DataStatus } from "@dashlane/carbon-api-consumers";
interface MasterPasswordUnlocker {
  confirmLabelMode: ConfirmLabelMode;
  onSuccess: () => void;
  onError?: () => void;
  onCancel?: () => void;
  showNeverAskOption?: false;
}
interface MasterPasswordCredentialUnlocker {
  confirmLabelMode: ConfirmLabelMode;
  onSuccess: () => void;
  onError?: () => void;
  onCancel?: () => void;
  showNeverAskOption: boolean;
  credentialId: string;
}
interface ProtectedItemsUnlockerContextInterface {
  openProtectedItemsUnlocker: (
    params: MasterPasswordUnlocker | MasterPasswordCredentialUnlocker
  ) => void;
  areProtectedItemsUnlocked: boolean;
}
export const ProtectedItemsUnlockerContext =
  React.createContext<ProtectedItemsUnlockerContextInterface>({
    openProtectedItemsUnlocker: () => {},
    areProtectedItemsUnlocked: false,
  });
export const ProtectedItemsUnlockerContextProvider: React.FunctionComponent = ({
  children,
}) => {
  const areProtectedItemsUnlocked = useAreProtectedItemsUnlocked();
  const protectPasswordsSetting = useProtectPasswordsSetting();
  const [unlockerParams, setUnlockerParams] = React.useState<
    MasterPasswordUnlocker | MasterPasswordCredentialUnlocker | null
  >(null);
  const contextValue = React.useMemo(
    () => ({
      areProtectedItemsUnlocked,
      openProtectedItemsUnlocker: setUnlockerParams,
    }),
    [areProtectedItemsUnlocked]
  );
  const successCallback = React.useCallback(() => {
    unlockerParams?.onSuccess();
    setUnlockerParams(null);
  }, [unlockerParams]);
  const cancelCallback = React.useCallback(() => {
    unlockerParams?.onCancel?.();
    setUnlockerParams(null);
  }, [unlockerParams]);
  const errorCallback = React.useCallback(() => {
    unlockerParams?.onError?.();
  }, [unlockerParams]);
  return (
    <ProtectedItemsUnlockerContext.Provider value={contextValue}>
      {children}
      {unlockerParams &&
      protectPasswordsSetting.status === DataStatus.Success ? (
        unlockerParams.showNeverAskOption ? (
          <MasterPasswordDialog
            confirmLabelMode={unlockerParams.confirmLabelMode}
            onCancel={cancelCallback}
            onSuccess={successCallback}
            onError={errorCallback}
            showNeverAskOption={unlockerParams.showNeverAskOption}
            credentialId={unlockerParams.credentialId}
            requirePasswordGlobalSetting={protectPasswordsSetting.data}
          />
        ) : (
          <MasterPasswordDialog
            confirmLabelMode={unlockerParams.confirmLabelMode}
            onCancel={cancelCallback}
            onSuccess={successCallback}
            onError={errorCallback}
          />
        )
      ) : null}
    </ProtectedItemsUnlockerContext.Provider>
  );
};
