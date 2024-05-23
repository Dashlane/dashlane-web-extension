import React from 'react';
import { Icon } from '@dashlane/design-system';
import { Origin, SharingFlowType, UserSharingStartEvent, } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
import { useIsAllowedToShare } from 'libs/carbon/hooks/useIsAllowedToShare';
import useTranslate from 'libs/i18n/useTranslate';
import { getPrivateCollectionSharing, getProtectedPrivateCollectionSharing, } from 'webapp/sharing-invite/helpers';
import { IsCollectionProtectedStatus, useIsCollectionProtected, } from 'webapp/sharing-invite/hooks/use-is-collection-protected';
import { SharingInviteDialog } from 'webapp/sharing-invite/sharing-invite-dialog';
import { SharingLimitReachedDialog } from 'webapp/sharing-invite/limit-reached';
import { useDialog } from 'webapp/dialog';
import { useAreProtectedItemsUnlocked } from 'webapp/unlock-items/hooks/use-are-protected-items-unlocked';
import { VaultHeaderButton } from 'webapp/components/header/vault-header-button';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { useCollectionPermissionsForUser } from 'webapp/sharing-invite/hooks/use-collection-permissions';
export const ShareCollectionButton = ({ id }: {
    id: string;
}) => {
    const areProtectedItemsUnlocked = useAreProtectedItemsUnlocked();
    const isAllowedToShare = useIsAllowedToShare();
    const { isCollectionsSharingEnabled } = useCollectionsContext();
    const [isCollectionProtected, isCollectionProtectedStatus] = useIsCollectionProtected(id);
    const { canShare } = useCollectionPermissionsForUser(id);
    const { openDialog, closeDialog } = useDialog();
    const { translate } = useTranslate();
    if (!isCollectionsSharingEnabled) {
        return null;
    }
    const onClickShare = () => {
        logEvent(new UserSharingStartEvent({
            sharingFlowType: SharingFlowType.CollectionSharing,
            collectionId: id,
            origin: Origin.CollectionDetailView,
        }));
        if (isAllowedToShare) {
            const shouldShowUnlockStep = !areProtectedItemsUnlocked &&
                isCollectionProtectedStatus === IsCollectionProtectedStatus.Complete &&
                isCollectionProtected;
            const sharing = shouldShowUnlockStep
                ? getProtectedPrivateCollectionSharing(id)
                : getPrivateCollectionSharing(id);
            openDialog(<SharingInviteDialog sharing={sharing} onDismiss={closeDialog} origin={Origin.CollectionDetailView}/>);
        }
        else {
            openDialog(<SharingLimitReachedDialog closeDialog={closeDialog}/>);
        }
    };
    return (<VaultHeaderButton onClick={onClickShare} icon={<Icon name="ActionShareOutlined"/>} disabled={!canShare}>
      {translate('_common_action_share')}
    </VaultHeaderButton>);
};
