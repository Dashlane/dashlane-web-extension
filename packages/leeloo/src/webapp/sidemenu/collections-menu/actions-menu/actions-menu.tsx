import React, { useCallback } from 'react';
import { Badge, Button } from '@dashlane/design-system';
import { DropdownMenu, MoreIcon } from '@dashlane/ui-components';
import { Origin, PageView, SharingFlowType, UserSharingStartEvent, } from '@dashlane/hermes';
import { ShareableCollection } from '@dashlane/sharing-contracts';
import { useFeatureFlips } from '@dashlane/framework-react';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { DropdownDeleteAction, DropdownEditAction, DropdownShareAction, DropdownSharedAccessAction, } from './actions';
import { DeleteDialog, EditDialog, SharedAccessDialog, } from 'webapp/vault/collection-view/dialogs';
import { useDialog } from 'webapp/dialog';
import { SharingInviteDialog } from 'webapp/sharing-invite/sharing-invite-dialog';
import { SharingLimitReachedDialog } from 'webapp/sharing-invite/limit-reached';
import { useIsAllowedToShare } from 'libs/carbon/hooks/useIsAllowedToShare';
import { getPrivateCollectionSharing, getProtectedPrivateCollectionSharing, } from 'webapp/sharing-invite/helpers';
import { IsCollectionProtectedStatus, useIsCollectionProtected, } from 'webapp/sharing-invite/hooks/use-is-collection-protected';
import { useAreProtectedItemsUnlocked } from 'webapp/unlock-items/hooks/use-are-protected-items-unlocked';
import { useCollectionPermissionsForUser } from 'webapp/sharing-invite/hooks/use-collection-permissions';
import { useCollectionSharingStatus } from 'webapp/paywall/paywall/collection-sharing';
const I18N_KEYS = {
    MORE_ACTIONS: 'webapp_credentials_grid_item_more_actions',
    UPGRADE: 'webapp_sidemenu_sharing_collection_upgrade_badge'
};
interface Props {
    collection: ShareableCollection;
}
export const ActionsMenu = ({ collection }: Props) => {
    const { translate } = useTranslate();
    const { openDialog, closeDialog, isDialogVisible } = useDialog();
    const isAllowedToShare = useIsAllowedToShare();
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const retrievedFeatureFlips = useFeatureFlips();
    const isCollectionSharingEnabled = Boolean(retrievedFeatureFlips.data?.['sharing_web_collectionsSharing']);
    const areProtectedItemsUnlocked = useAreProtectedItemsUnlocked();
    const [isCollectionProtected, isCollectionProtectedStatus] = useIsCollectionProtected(collection.id);
    const { canDelete, canEdit, canShare } = useCollectionPermissionsForUser(collection.id);
    const { canShareCollection, hasSharingCollectionPaywall, isAdmin } = useCollectionSharingStatus();
    const displayUpgradeSharingBadge = hasSharingCollectionPaywall && isAdmin && !canShareCollection;
    const { id, name, spaceId, isShared } = collection;
    const isPersonalCollection = spaceId === '' || spaceId === null;
    const onClickShare = useCallback(() => {
        logEvent(new UserSharingStartEvent({
            sharingFlowType: SharingFlowType.CollectionSharing,
            collectionId: id,
            origin: Origin.CollectionListViewQuickActionsDropdown,
        }));
        if (isAllowedToShare) {
            const shouldShowUnlockStep = !areProtectedItemsUnlocked &&
                isCollectionProtectedStatus === IsCollectionProtectedStatus.Complete &&
                isCollectionProtected;
            const sharing = shouldShowUnlockStep
                ? getProtectedPrivateCollectionSharing(id)
                : getPrivateCollectionSharing(id);
            openDialog(<SharingInviteDialog sharing={sharing} onDismiss={closeDialog} origin={Origin.CollectionLeftHandSideMenuQuickActionsDropdown}/>);
        }
        else {
            openDialog(<SharingLimitReachedDialog closeDialog={closeDialog}/>);
        }
    }, [
        closeDialog,
        id,
        isAllowedToShare,
        isCollectionProtected,
        isCollectionProtectedStatus,
        areProtectedItemsUnlocked,
        openDialog,
    ]);
    const onClickSharedAccessAction = () => {
        openDialog(<SharedAccessDialog id={id} onClose={closeDialog}/>);
    };
    const dropDownActions = [
        isCollectionSharingEnabled ? (<DropdownShareAction key="share" onClick={onClickShare} disabled={!canShare ||
                isPersonalCollection ||
                isCollectionProtectedStatus !== IsCollectionProtectedStatus.Complete} badge={displayUpgradeSharingBadge ? (<Badge mood="brand" intensity="catchy" label={translate(I18N_KEYS.UPGRADE)} layout="iconLeading" iconName="PremiumOutlined"/>) : undefined}/>) : undefined,
        isCollectionSharingEnabled && isShared ? (<DropdownSharedAccessAction key="shared-access" onClick={onClickSharedAccessAction}/>) : undefined,
        <DropdownEditAction key="edit" setIsEditDialogOpen={setIsEditDialogOpen} disabled={!canEdit}/>,
        <DropdownDeleteAction key="delete" setIsDeleteDialogOpen={setIsDeleteDialogOpen} disabled={!canDelete}/>,
    ].filter(Boolean);
    React.useEffect(() => {
        if (isEditDialogOpen) {
            logPageView(PageView.CollectionEdit);
        }
        if (isDeleteDialogOpen) {
            logPageView(PageView.CollectionDelete);
        }
    }, [isEditDialogOpen, isDeleteDialogOpen]);
    return (<>
      <DropdownMenu sx={{ zIndex: 1 }} content={dropDownActions} placement="top" passThrough={isDialogVisible || isEditDialogOpen || isDeleteDialogOpen}>
        <Button aria-label={translate(I18N_KEYS.MORE_ACTIONS)} icon={<MoreIcon />} intensity="supershy" layout="iconOnly" mood="brand" size="medium" style={{ padding: '15px', borderRadius: '0' }} onClick={(event) => {
            event.stopPropagation();
            logPageView(PageView.CollectionQuickActionsDropdown);
        }}/>
      </DropdownMenu>
      {isEditDialogOpen && (<EditDialog id={id} name={name} spaceId={spaceId} onClose={() => setIsEditDialogOpen(false)} isShared={isShared}/>)}
      {isDeleteDialogOpen && (<DeleteDialog isShared={isShared} id={id} name={name} onClose={() => setIsDeleteDialogOpen(false)} setIsSharedAccessDialogOpen={onClickSharedAccessAction}/>)}
    </>);
};
