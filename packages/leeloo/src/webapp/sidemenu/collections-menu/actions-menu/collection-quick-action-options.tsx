import { useCallback } from "react";
import { Badge, Tooltip } from "@dashlane/design-system";
import {
  ShareableCollection,
  SharedCollectionRole,
} from "@dashlane/sharing-contracts";
import {
  Origin,
  SharingFlowType,
  UserSharingStartEvent,
} from "@dashlane/hermes";
import { logEvent } from "../../../../libs/logs/logEvent";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useIsAllowedToShare } from "../../../../libs/hooks/use-is-allowed-to-share";
import { useDialog } from "../../../dialog";
import { SharedAccessDialog } from "../../../collections/collection-view/dialogs";
import { SharingLimitReachedDialog } from "../../../sharing-invite/limit-reached";
import { SharingInviteDialog } from "../../../sharing-invite/sharing-invite-dialog";
import {
  IsCollectionProtectedStatus,
  useIsCollectionProtected,
} from "../../../sharing-invite/hooks/use-is-collection-protected";
import {
  getPrivateCollectionSharing,
  getProtectedPrivateCollectionSharing,
} from "../../../sharing-invite/helpers";
import { useCollectionPermissionsForUser } from "../../../sharing-invite/hooks/use-collection-permissions";
import { useAreProtectedItemsUnlocked } from "../../../unlock-items/hooks/use-are-protected-items-unlocked";
import { useCollectionSharingStatus } from "../../../paywall/paywall/collection-sharing";
import {
  CollectionActionDisabledTooltip,
  sharingDisabledTooltipTitleAndDescription,
} from "../../../collections/collection-view/collection-view-header/action-disabled-tooltip";
import {
  DropdownDeleteAction,
  DropdownEditAction,
  DropdownShareAction,
  DropdownSharedAccessAction,
} from "./actions";
const I18N_KEYS = {
  ACTION_DISABLED_EDITOR: "webapp_collection_action_disabled_editor_title",
  ACTION_DISABLED_EDITOR_DESCRIPTION:
    "webapp_collection_action_disabled_editor_description",
  UPGRADE: "webapp_sidemenu_sharing_collection_upgrade_badge",
};
interface Props {
  collection: ShareableCollection;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
}
export const CollectionQuickActionOptions = ({
  collection,
  setIsDeleteDialogOpen,
  setIsEditDialogOpen,
}: Props) => {
  const { openDialog, closeDialog } = useDialog();
  const { translate } = useTranslate();
  const isAllowedToShare = useIsAllowedToShare();
  const areProtectedItemsUnlocked = useAreProtectedItemsUnlocked();
  const [isCollectionProtected, isCollectionProtectedStatus] =
    useIsCollectionProtected(collection.id);
  const { canDelete, canEdit, canShare, role, sharingDisabledReason } =
    useCollectionPermissionsForUser(collection.id);
  const {
    canShareCollection,
    hasSharingCollectionPaywall,
    isAdmin,
    isStarterTeam,
  } = useCollectionSharingStatus();
  const displayUpgradeSharingBadge =
    hasSharingCollectionPaywall && isAdmin && !canShareCollection;
  const displayNonAdminSharingCollectionPaywall =
    isStarterTeam && !isAdmin && role === SharedCollectionRole.Manager;
  const { id, spaceId, isShared } = collection;
  const isPersonalCollection = spaceId === "" || spaceId === null;
  const onClickShare = useCallback(() => {
    logEvent(
      new UserSharingStartEvent({
        sharingFlowType: SharingFlowType.CollectionSharing,
        collectionId: id,
        origin: Origin.CollectionListViewQuickActionsDropdown,
      })
    );
    if (isAllowedToShare) {
      const shouldShowUnlockStep =
        !areProtectedItemsUnlocked &&
        isCollectionProtectedStatus === IsCollectionProtectedStatus.Complete &&
        isCollectionProtected;
      const sharing = shouldShowUnlockStep
        ? getProtectedPrivateCollectionSharing(id)
        : getPrivateCollectionSharing(id);
      openDialog(
        <SharingInviteDialog
          sharing={sharing}
          onDismiss={closeDialog}
          origin={Origin.CollectionLeftHandSideMenuQuickActionsDropdown}
        />
      );
    } else {
      openDialog(<SharingLimitReachedDialog closeDialog={closeDialog} />);
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
    openDialog(<SharedAccessDialog id={id} onClose={closeDialog} />);
  };
  const isSharingDisabled =
    (!displayNonAdminSharingCollectionPaywall && !canShare) ||
    isPersonalCollection ||
    isCollectionProtectedStatus !== IsCollectionProtectedStatus.Complete;
  const isSharingEditor = role !== SharedCollectionRole.Manager;
  const tooltipTitle = sharingDisabledTooltipTitleAndDescription(
    sharingDisabledReason
  )?.title;
  const tooltipDescription = sharingDisabledTooltipTitleAndDescription(
    sharingDisabledReason
  )?.description;
  return (
    <>
      {!isPersonalCollection && (
        <Tooltip
          content={
            <CollectionActionDisabledTooltip
              tooltipTitle={tooltipTitle ? translate(tooltipTitle) : ""}
              tooltipDescription={
                tooltipDescription ? translate(tooltipDescription) : ""
              }
            />
          }
          passThrough={
            !isSharingDisabled || (!tooltipTitle && !tooltipDescription)
          }
          wrapTrigger
        >
          <DropdownShareAction
            key="share"
            onClick={onClickShare}
            disabled={isSharingDisabled}
            badge={
              displayUpgradeSharingBadge ? (
                <Badge
                  mood="brand"
                  intensity="catchy"
                  label={translate(I18N_KEYS.UPGRADE)}
                  layout="iconLeading"
                  iconName="PremiumOutlined"
                />
              ) : undefined
            }
          />
        </Tooltip>
      )}
      {isShared ? (
        <DropdownSharedAccessAction
          key="shared-access"
          onClick={onClickSharedAccessAction}
        />
      ) : null}
      <Tooltip
        content={
          <CollectionActionDisabledTooltip
            tooltipTitle={translate(I18N_KEYS.ACTION_DISABLED_EDITOR)}
            tooltipDescription={translate(
              I18N_KEYS.ACTION_DISABLED_EDITOR_DESCRIPTION
            )}
          />
        }
        passThrough={!isSharingEditor}
        wrapTrigger
      >
        <DropdownEditAction
          key="edit"
          setIsEditDialogOpen={() => setIsEditDialogOpen(true)}
          disabled={!canEdit}
        />
      </Tooltip>
      <Tooltip
        content={
          <CollectionActionDisabledTooltip
            tooltipTitle={translate(I18N_KEYS.ACTION_DISABLED_EDITOR)}
            tooltipDescription={translate(
              I18N_KEYS.ACTION_DISABLED_EDITOR_DESCRIPTION
            )}
          />
        }
        passThrough={!isSharingEditor}
        wrapTrigger
      >
        <DropdownDeleteAction
          key="delete"
          setIsDeleteDialogOpen={() => setIsDeleteDialogOpen(true)}
          disabled={!canDelete}
        />
      </Tooltip>
    </>
  );
};
