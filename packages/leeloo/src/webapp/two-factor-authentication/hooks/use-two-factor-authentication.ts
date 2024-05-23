import React, { useCallback } from 'react';
import { TwoFactorAuthenticationEnableContainer } from 'webapp/two-factor-authentication/containers/two-factor-authentication-enable-container';
import { TwoFactorAuthenticationDisableContainer } from 'webapp/two-factor-authentication/containers/two-factor-authentication-disable-container';
import { LockedItemType } from 'webapp/unlock-items/types';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
import { useDialog } from 'webapp/dialog';
import { I18N_KEYS_SECURITY_SETTINGS } from 'webapp/unlock-items/constants';
import { logTwoFactorAuthenticationEnableCancelEvent } from '../logs/enable-flow-logs';
interface Type {
    readonly openTwoFactorAuthenticationDisablerDialog: () => void;
    readonly openTwoFactorAuthenticationEnablerDialog: () => void;
}
interface Props {
    onDialogStateChanged?: (isDialogOpened: boolean) => void;
    onSuccess?: () => void;
}
export function useTwoFactorAuthentication(props: Props = {}): Type {
    const { onDialogStateChanged, onSuccess } = props;
    const { openDialog, closeDialog } = useDialog();
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const openTwoFactorAuthenticationDisablerDialog = useCallback(() => {
        onDialogStateChanged?.(true);
        openDialog(React.createElement(TwoFactorAuthenticationDisableContainer, {
            onDialogClose: () => {
                closeDialog();
                onDialogStateChanged?.(false);
            },
        }));
    }, [onDialogStateChanged, openDialog, closeDialog]);
    const openTwoFactorAuthenticationEnablerDialog = useCallback(() => {
        const onDialogUnlocked = () => {
            openDialog(React.createElement(TwoFactorAuthenticationEnableContainer, {
                onDialogClose: (cancelled?: boolean) => {
                    if (!cancelled) {
                        onSuccess?.();
                    }
                    closeDialog();
                    onDialogStateChanged?.(false);
                },
            }));
        };
        onDialogStateChanged?.(true);
        if (areProtectedItemsUnlocked) {
            onDialogUnlocked();
        }
        else {
            openProtectedItemsUnlocker({
                itemType: LockedItemType.SecuritySettings,
                options: I18N_KEYS_SECURITY_SETTINGS,
                successCallback: onDialogUnlocked,
                cancelCallback: () => {
                    logTwoFactorAuthenticationEnableCancelEvent();
                    onDialogStateChanged?.(false);
                },
            });
        }
    }, [
        onDialogStateChanged,
        areProtectedItemsUnlocked,
        openDialog,
        closeDialog,
        onSuccess,
        openProtectedItemsUnlocker,
    ]);
    return {
        openTwoFactorAuthenticationDisablerDialog,
        openTwoFactorAuthenticationEnablerDialog,
    };
}
