import { VaultItemThumbnail } from "@dashlane/design-system";
import { SecureNote as Item } from "@dashlane/vault-contracts";
import { logSelectSecureNote } from "../../../../libs/logs/events/vault/select-item";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { SecureNotesQuickActions } from "../../../secure-notes/list/secure-notes-quick-actions";
import SearchEventLogger from "../../../sidemenu/search/search-event-logger";
import {
  UnlockerAction,
  useProtectedItemsUnlocker,
} from "../../../unlock-items";
import { LockedItemType } from "../../../unlock-items/types";
import { useSearchContext } from "../../search-context";
import { getNoteDescription } from "../helpers/get-note-description";
import { getNoteMatchingColor } from "../helpers/get-note-matching-color";
import { BaseResultItem } from "../shared/base-result-item";
import { SearchResultVaultItemProps } from "../shared/types";
export const SecureNoteItem = ({
  item,
  index,
  matchCount,
}: SearchResultVaultItemProps) => {
  const note = item as Item;
  const { routes } = useRouterGlobalSettingsContext();
  const { closeSearch } = useSearchContext();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const { content, isSecured, title } = note;
  const description = getNoteDescription(isSecured, content);
  const route = routes.userSecureNote(note.id);
  const onClick = () => {
    SearchEventLogger.logSearchEvent();
    logSelectSecureNote(note.id, index + 1, matchCount);
    closeSearch();
    const successCallback = () => {
      redirect(route);
    };
    const isNoteLocked = isSecured && !areProtectedItemsUnlocked;
    if (isNoteLocked) {
      openProtectedItemsUnlocker({
        action: UnlockerAction.Show,
        itemType: LockedItemType.SecureNote,
        successCallback,
      });
    } else {
      successCallback();
    }
  };
  const actions = (
    <div sx={{ display: "flex", flexDirection: "row", gap: "8px" }}>
      <SecureNotesQuickActions
        note={note}
        secureNoteItemRoute={route}
        triggerButton={{
          mood: "brand",
          intensity: "supershy",
          size: "small",
        }}
      />
    </div>
  );
  return (
    <BaseResultItem
      id={note.id}
      title={title}
      description={description}
      onClick={onClick}
      thumbnail={
        <VaultItemThumbnail
          type="secure-note"
          color={getNoteMatchingColor(note.color)}
        />
      }
      actions={actions}
    />
  );
};
