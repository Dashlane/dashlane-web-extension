import { useState } from "react";
import {
  ButtonProps,
  DropdownContent,
  DropdownMenu,
  DropdownTriggerButton,
} from "@dashlane/design-system";
import { SecureNote } from "@dashlane/vault-contracts";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { Origin } from "@dashlane/hermes";
import { useModuleQueries } from "@dashlane/framework-react";
import { Permission, sharingItemsApi } from "@dashlane/sharing-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { redirect } from "../../../libs/router";
import { useFrozenState } from "../../../libs/frozen-state/frozen-state-dialog-context";
import { getNoteSharing } from "../../sharing-invite/helpers";
import { CollectionQuickActions } from "../../collections/collection-quick-actions";
import { MenuItem } from "../../credentials/quick-actions-menu/menu/menu-item";
import { SharingInviteDialog } from "../../sharing-invite/sharing-invite-dialog";
import { SharingLimitReachedDialog } from "../../sharing-invite/limit-reached";
import { useDialog } from "../../dialog";
import { UnlockerAction, useProtectedItemsUnlocker } from "../../unlock-items";
import { LockedItemType } from "../../unlock-items/types";
const I18N_KEYS = {
  EDIT_ITEM: "webapp_credentials_quick_actions_edit_item",
  SHARE: "webapp_sharing_invite_share",
  ACTIONS_MENU: "webapp_credentials_row_accessibility_actions_menu",
};
interface SecureNotesQuickActionsProps {
  note: SecureNote;
  secureNoteItemRoute: string;
  triggerButton?: ButtonProps;
}
export const SecureNotesQuickActions = ({
  note,
  secureNoteItemRoute,
  triggerButton,
}: SecureNotesQuickActionsProps) => {
  const { translate } = useTranslate();
  const { openDialog, closeDialog } = useDialog();
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const { getPermissionForItem, getSharingStatusForItem } = useModuleQueries(
    sharingItemsApi,
    {
      getPermissionForItem: {
        queryParam: {
          itemId: note.id,
        },
      },
      getSharingStatusForItem: {
        queryParam: {
          itemId: note.id,
        },
      },
    },
    []
  );
  if (
    getPermissionForItem.status !== DataStatus.Success ||
    getSharingStatusForItem.status !== DataStatus.Success
  ) {
    return null;
  }
  const { isShared } = getSharingStatusForItem.data;
  const permission = getPermissionForItem.data?.permission;
  const isAdmin = permission ? permission === Permission.Admin : true;
  const isNoteLocked = note.isSecured && !areProtectedItemsUnlocked;
  const onEditItem = () => {
    setIsDropdownOpen(false);
    if (isNoteLocked) {
      openProtectedItemsUnlocker({
        action: UnlockerAction.Show,
        itemType: LockedItemType.SecureNote,
        successCallback: () => {
          redirect(secureNoteItemRoute);
        },
      });
    } else {
      redirect(secureNoteItemRoute);
    }
  };
  const isShareable = (item: SecureNote): boolean =>
    item && (!isShared || isAdmin) && !item.attachments?.length;
  const onClickShare = () => {
    const { id } = note;
    const sharing = getNoteSharing(id);
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
    } else if (sharing) {
      openDialog(
        <SharingInviteDialog
          sharing={sharing}
          onDismiss={closeDialog}
          origin={Origin.ItemListView}
        />
      );
    } else {
      openDialog(<SharingLimitReachedDialog closeDialog={closeDialog} />);
    }
    setIsDropdownOpen(false);
  };
  return (
    <DropdownMenu
      isOpen={isDropdownOpen}
      onOpenChange={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <DropdownTriggerButton
        mood="neutral"
        intensity="quiet"
        icon="ActionMoreOutlined"
        layout="iconOnly"
        aria-label={translate(I18N_KEYS.ACTIONS_MENU)}
        {...triggerButton}
      />
      <DropdownContent>
        <MenuItem
          icon="ActionEditOutlined"
          onClick={onEditItem}
          closeOnClick
          text={translate(I18N_KEYS.EDIT_ITEM)}
        />

        {isShareable(note) ? (
          <MenuItem
            onClick={onClickShare}
            closeOnClick
            icon="ActionShareOutlined"
            text={translate(I18N_KEYS.SHARE)}
          />
        ) : null}
        {!note.attachments?.length ? (
          <CollectionQuickActions
            itemId={note.id}
            itemName={note.title}
            itemSpaceId={note.spaceId ?? ""}
            isSharedWithLimitedRights={!isAdmin}
            onActionComplete={() => setIsDropdownOpen(false)}
          />
        ) : null}
      </DropdownContent>
    </DropdownMenu>
  );
};
