import React, { useCallback } from 'react';
import { U2FAuthenticatorRemoveContainer } from 'webapp/two-factor-authentication/u2f-authenticators/containers/u2f-authenticator-remove-container';
import { useDialog } from 'webapp/dialog';
interface Type {
    readonly openU2FRemoveAuthenticatorDialog: (keyHandle: string) => void;
}
interface Props {
    onDialogStateChanged?: (isDialogOpened: boolean) => void;
}
export function useU2FDialogs(props: Props = {}): Type {
    const { onDialogStateChanged } = props;
    const { openDialog, closeDialog } = useDialog();
    const openU2FRemoveAuthenticatorDialog = useCallback((keyHandle) => {
        onDialogStateChanged?.(true);
        openDialog(React.createElement(U2FAuthenticatorRemoveContainer, {
            onDialogClose: () => {
                closeDialog();
                onDialogStateChanged?.(false);
            },
            keyHandle,
        }));
    }, [onDialogStateChanged, openDialog, closeDialog]);
    return {
        openU2FRemoveAuthenticatorDialog,
    };
}
