import { CredentialDetailView, ShareItemFailureReason, } from '@dashlane/communication';
import { jsx } from '@dashlane/design-system';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { SecureNote, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { TranslateFunction } from 'libs/i18n/types';
import { DetailedItem } from 'libs/dashlane-style/detailed-item';
import { getCredentialLogo, getNoteLogo, itemSx, } from 'webapp/sharing-invite/item';
import { DetailedError } from 'webapp/sharing-invite/types';
function getSharingFailureMessage(translate: TranslateFunction, reason?: ShareItemFailureReason): string {
    const { ITEM_DOESNT_EXIST, LIMIT_EXCEEDED } = ShareItemFailureReason;
    switch (reason) {
        case ITEM_DOESNT_EXIST:
            return translate('webapp_sharing_invite_item_not_found');
        case LIMIT_EXCEEDED:
            return translate('webapp_sharing_invite_limit_exceeded');
        default:
            return translate('webapp_sharing_invite_server_error');
    }
}
function renderCredentialErrorItem(credential: CredentialDetailView, message: string): JSX.Element {
    const logo = getCredentialLogo(credential);
    const { title, email, login } = credential;
    const text = email || login;
    const detailedItemParams = { title, text, logo, infoAction: message };
    return <DetailedItem {...detailedItemParams}/>;
}
function renderNoteErrorItem(note: SecureNote, message: string): JSX.Element {
    const logo = getNoteLogo(note);
    const { title } = note;
    const detailedItemParams = { title, text: '', logo, infoAction: message };
    return <DetailedItem {...detailedItemParams}/>;
}
export interface Props<T> {
    translate: TranslateFunction;
    detailedError: DetailedError;
    itemId: string;
    item: T;
}
export interface NoteProps {
    translate: TranslateFunction;
    detailedError: DetailedError;
    itemId: string;
}
export const CredentialError = (props: Props<CredentialDetailView>) => {
    const { detailedError, translate, item } = props;
    if (!item) {
        return (<li sx={itemSx}>{translate('webapp_sharing_invite_item_removed')}</li>);
    }
    const { itemId, result: { reason }, } = detailedError;
    const message = getSharingFailureMessage(translate, reason);
    return (<li key={itemId} sx={itemSx}>
      {renderCredentialErrorItem(item, message)}
    </li>);
};
export const NoteError = (props: NoteProps) => {
    const { detailedError, translate, itemId } = props;
    const { data: secureNoteData, status } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.SecureNote],
        ids: [itemId],
    });
    if (status !== DataStatus.Success) {
        return null;
    }
    const secureNotes = secureNoteData.secureNotesResult?.items;
    if (!secureNotes?.length) {
        return (<li sx={itemSx}>{translate('webapp_sharing_invite_item_removed')}</li>);
    }
    const { result: { reason }, } = detailedError;
    const message = getSharingFailureMessage(translate, reason);
    return (<li key={secureNotes[0].id} sx={itemSx}>
      {renderNoteErrorItem(secureNotes[0], message)}
    </li>);
};
