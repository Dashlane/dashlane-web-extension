import React, { useCallback } from 'react';
import { WebAuthnEnabler } from '../containers/webauthn-enabler';
import { WebAuthnDisableLastAuthenticator } from '../containers/webauthn-disable-last-authenticator';
import { disableWebAuthnAuthentication, removeWebAuthnAuthenticator, } from 'webapp/webauthn/services';
import { LockedItemType } from 'webapp/unlock-items/types';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
import { useDialog } from 'webapp/dialog';
interface Props {
    onDialogStateChanged?: (isDialogOpened: boolean) => void;
}
interface Type {
    readonly openWebAuthnEnablerDialog: () => void;
    readonly openWebAuthnDisablerDialog: () => void;
    readonly openWebAuthnRemoveLastAuthenticatorDialog: (credentialId: string, isRoaming: boolean) => void;
    readonly onRemoveWebAuthnAuthenticator: (credentialId: string, isRoaming: boolean) => void;
}
export function useWebAuthn(props: Props = {}): Type {
    const { onDialogStateChanged } = props;
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const { openDialog, closeDialog } = useDialog();
    const openWebAuthnEnablerDialog = useCallback(() => {
        const onUnlockSuccess = () => {
            openDialog(React.createElement(WebAuthnEnabler, {
                onDialogClose: () => {
                    closeDialog();
                    onDialogStateChanged?.(false);
                },
            }));
        };
        onDialogStateChanged?.(true);
        if (areProtectedItemsUnlocked) {
            onUnlockSuccess();
        }
        else {
            openProtectedItemsUnlocker({
                itemType: LockedItemType.SecuritySettings,
                successCallback: onUnlockSuccess,
                cancelCallback: () => {
                    onDialogStateChanged?.(false);
                },
            });
        }
    }, [
        openDialog,
        closeDialog,
        areProtectedItemsUnlocked,
        openProtectedItemsUnlocker,
    ]);
    const openWebAuthnDisablerDialog = useCallback(() => {
        const onUnlockSuccess = disableWebAuthnAuthentication;
        if (areProtectedItemsUnlocked) {
            onUnlockSuccess();
        }
        else {
            openProtectedItemsUnlocker({
                itemType: LockedItemType.SecuritySettings,
                successCallback: onUnlockSuccess,
            });
        }
        disableWebAuthnAuthentication();
    }, [areProtectedItemsUnlocked, openProtectedItemsUnlocker]);
    const onRemoveWebAuthnAuthenticator = useCallback(async (credentialId: string): Promise<void> => {
        await removeWebAuthnAuthenticator(credentialId);
    }, []);
    const openWebAuthnRemoveLastAuthenticatorDialog = useCallback((credentialId: string) => {
        onDialogStateChanged?.(true);
        openDialog(React.createElement(WebAuthnDisableLastAuthenticator, {
            credentialId,
            onDialogClose: () => {
                closeDialog();
                onDialogStateChanged?.(false);
            },
        }));
    }, [openDialog, closeDialog]);
    return {
        openWebAuthnEnablerDialog,
        openWebAuthnDisablerDialog,
        openWebAuthnRemoveLastAuthenticatorDialog,
        onRemoveWebAuthnAuthenticator,
    };
}
