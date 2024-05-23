import React from 'react';
import { CredentialDetailView, NoteDetailView, SecretDetailView, } from '@dashlane/communication';
import { Origin } from '@dashlane/hermes';
import useTranslate from 'libs/i18n/useTranslate';
import { Sharing } from 'webapp/sharing-invite/types';
import { SharingButton as BaseSharingButton } from 'webapp/sharing-invite/sharing-button';
type ShareableDetailView = NoteDetailView | CredentialDetailView | SecretDetailView;
const isShareable = (item: ShareableDetailView): boolean => item &&
    (!item.sharingStatus.isShared || item.sharingStatus.permission === 'admin') &&
    !item.attachments.length;
const I18N_KEYS = {
    SHARING: 'webapp_sharing_invite_share',
};
interface GetSharingProp {
    getSharing: (id: string) => Sharing;
}
interface Props extends GetSharingProp {
    item: ShareableDetailView;
}
interface PropsWithSharingInfo extends GetSharingProp {
    id: string;
    isShared: boolean;
    isAdmin: boolean;
    isDiscontinuedUser: boolean;
}
const SharingButton = ({ sharing }: {
    sharing: Sharing;
}) => {
    const { translate } = useTranslate();
    return (<BaseSharingButton tooltipPlacement="top-start" sharing={sharing} text={translate(I18N_KEYS.SHARING)} origin={Origin.ItemDetailView}/>);
};
export const GrapheneShareActions = ({ id, isShared, isAdmin, isDiscontinuedUser, getSharing, }: PropsWithSharingInfo): JSX.Element | null => {
    if ((isShared && !isAdmin) || isDiscontinuedUser) {
        return null;
    }
    return <SharingButton sharing={getSharing(id)}/>;
};
export const ShareActions = ({ item, getSharing, }: Props): JSX.Element | null => {
    if (!isShareable(item)) {
        return null;
    }
    return <SharingButton sharing={getSharing(item.id)}/>;
};
