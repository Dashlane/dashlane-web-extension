import * as React from 'react';
import { PasswordInput as PasswordInputBase } from '@dashlane/ui-components';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
import { LockedItemType, UnlockerAction } from 'webapp/unlock-items/types';
type ForbiddenProps = 'onPasswordVisibilityChangeRequest';
type PasswordInputPropsBase = React.ComponentPropsWithoutRef<typeof PasswordInputBase>;
export type PasswordInputProps = Omit<PasswordInputPropsBase, ForbiddenProps> & {
    credentialId?: string;
    requiresMasterPassword?: boolean;
};
export const PasswordInput = (props: PasswordInputProps): JSX.Element => {
    const { requiresMasterPassword, credentialId, ...prop } = props;
    const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } = useProtectedItemsUnlocker();
    const onPasswordVisibilityChangeHandler = React.useCallback((newVisibility: boolean): Promise<void> => {
        if (!newVisibility ||
            areProtectedItemsUnlocked ||
            !requiresMasterPassword ||
            !credentialId) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            openProtectedItemsUnlocker({
                action: UnlockerAction.Show,
                itemType: LockedItemType.Password,
                showNeverAskOption: true,
                credentialId: credentialId,
                successCallback: resolve,
                cancelCallback: reject,
            });
        });
    }, [
        areProtectedItemsUnlocked,
        credentialId,
        openProtectedItemsUnlocker,
        requiresMasterPassword,
    ]);
    return (<PasswordInputBase {...prop} onPasswordVisibilityChangeRequest={onPasswordVisibilityChangeHandler}/>);
};
