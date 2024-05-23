import * as React from 'react';
import { CredentialPasswordHistoryItemView, PasswordHistoryItemView, } from '@dashlane/communication';
import { useProtectPasswordsSetting } from 'libs/carbon/hooks/useProtectPasswordsSetting';
import Row from 'webapp/list-view/row';
import { formatPasswordHistoryItem, isItemPasswordProtected, } from 'webapp/password-history/list/helpers';
import { PasswordCopyHandlerParams } from 'webapp/password-history/types';
interface Props {
    item: PasswordHistoryItemView;
    onPasswordCopied: (copyHandlerParams: PasswordCopyHandlerParams) => void;
    onCreateNewCredential: (generatedPassword: string, website?: string) => void;
    onOpenRestorePasswordDialog: (newSelectedItem: CredentialPasswordHistoryItemView) => void;
}
export const PasswordHistoryRow = ({ item, onPasswordCopied, onCreateNewCredential, onOpenRestorePasswordDialog, }: Props) => {
    const mpSettingsResponse = useProtectPasswordsSetting();
    const isProtected = isItemPasswordProtected(item, mpSettingsResponse);
    const content = formatPasswordHistoryItem(item, onPasswordCopied, isProtected, onCreateNewCredential, onOpenRestorePasswordDialog);
    return <Row {...content} key={item.id}/>;
};
