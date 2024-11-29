import { Icon, Tooltip } from "@dashlane/design-system";
import {
  Origin,
  SharingFlowType,
  UserSharingStartEvent,
} from "@dashlane/hermes";
import { SharedCollectionRole } from "@dashlane/sharing-contracts";
import { logEvent } from "../../../../libs/logs/logEvent";
import { useIsAllowedToShare } from "../../../../libs/hooks/use-is-allowed-to-share";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  getPrivateCollectionSharing,
  getProtectedPrivateCollectionSharing,
} from "../../../sharing-invite/helpers";
import {
  IsCollectionProtectedStatus,
  useIsCollectionProtected,
} from "../../../sharing-invite/hooks/use-is-collection-protected";
import { SharingInviteDialog } from "../../../sharing-invite/sharing-invite-dialog";
import { SharingLimitReachedDialog } from "../../../sharing-invite/limit-reached";
import { useDialog } from "../../../dialog";
import { useAreProtectedItemsUnlocked } from "../../../unlock-items/hooks/use-are-protected-items-unlocked";
import { VaultHeaderButton } from "../../../components/header/vault-header-button";
import { useCollectionPermissionsForUser } from "../../../sharing-invite/hooks/use-collection-permissions";
import { useCollectionSharingStatus } from "../../../paywall/paywall/collection-sharing";
import { useSecureNotesContext } from "../../../secure-notes/secure-notes-view/secure-notes-context";
import {
  CollectionActionDisabledTooltip,
  sharingDisabledTooltipTitleAndDescription,
} from "./action-disabled-tooltip";
export const ShareCollectionButton = ({ id }: { id: string }) => {
  const areProtectedItemsUnlocked = useAreProtectedItemsUnlocked();
  const isAllowedToShare = useIsAllowedToShare();
  const [isCollectionProtected, isCollectionProtectedStatus] =
    useIsCollectionProtected(id);
  const { role, canShare, sharingDisabledReason } =
    useCollectionPermissionsForUser(id);
  const { openDialog, closeDialog } = useDialog();
  const { translate } = useTranslate();
  const { isStarterTeam, isAdmin } = useCollectionSharingStatus();
  const displayNonAdminSharingCollectionPaywall =
    isStarterTeam && !isAdmin && role === SharedCollectionRole.Manager;
  const { secureNotes } = useSecureNotesContext();
  const hasNotesWithAttachments = secureNotes.some(
    (note) => note.attachments?.length
  );
  const isSharingDisabled =
    (!displayNonAdminSharingCollectionPaywall && !canShare) ||
    isCollectionProtectedStatus !== IsCollectionProtectedStatus.Complete ||
    hasNotesWithAttachments;
  const onClickShare = () => {
    logEvent(
      new UserSharingStartEvent({
        sharingFlowType: SharingFlowType.CollectionSharing,
        collectionId: id,
        origin: Origin.CollectionDetailView,
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
          origin={Origin.CollectionDetailView}
        />
      );
    } else {
      openDialog(<SharingLimitReachedDialog closeDialog={closeDialog} />);
    }
  };
  const tooltipTitle = sharingDisabledTooltipTitleAndDescription(
    sharingDisabledReason
  )?.title;
  const tooltipDescription = sharingDisabledTooltipTitleAndDescription(
    sharingDisabledReason
  )?.description;
  return (
    <Tooltip
      content={
        <CollectionActionDisabledTooltip
          tooltipTitle={tooltipTitle ? translate(tooltipTitle) : ""}
          tooltipDescription={
            tooltipDescription ? translate(tooltipDescription) : ""
          }
        />
      }
      passThrough={!isSharingDisabled || (!tooltipTitle && !tooltipDescription)}
      wrapTrigger
    >
      <VaultHeaderButton
        onClick={onClickShare}
        icon={<Icon name="ActionShareOutlined" />}
        disabled={isSharingDisabled}
      >
        {translate("_common_action_share")}
      </VaultHeaderButton>
    </Tooltip>
  );
};
