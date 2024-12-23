import { useRef } from "react";
import { CredentialSearchOrder } from "@dashlane/communication";
import { jsx } from "@dashlane/design-system";
import { Highlight, ItemType } from "@dashlane/hermes";
import { LoaderIcon } from "@dashlane/ui-components";
import { SecureNote, VaultItemType } from "@dashlane/vault-contracts";
import { useIntersectionObserver } from "../../../../../libs/hooks/useIntersectionObserver";
import { logSelectVaultItem } from "../../../../../libs/logs/events/vault/select-item";
import { ConfirmLabelMode } from "../../../../protected-items-unlocker/master-password-dialog";
import useProtectedItemsUnlocker from "../../../../protected-items-unlocker/useProtectedItemsUnlocker";
import { useVaultItemDetailView } from "../../../detail-views";
import SearchEventLogger from "../../../search-event-logger";
import { useSearchContext } from "../../../search-field/search-context";
import { VaultItemOrigin } from "../../../types";
import { SectionListHeaderWithSort } from "../common";
import { SectionCard } from "../common/components/section-card";
import { SectionList } from "../common/section-list";
import styles from "../common/sharedListStyles.css";
import { SecureNoteItem } from "./secure-note-item/secure-note-item";
interface SecureNotesListProps {
  notes: SecureNote[];
  notesCount: number;
  onOrderChange: (value: CredentialSearchOrder) => void;
  order: CredentialSearchOrder;
  hasMore: boolean;
  isNextPageLoading: boolean;
  onLoadMore: () => void;
}
export const SecureNotesList = ({
  notes,
  notesCount,
  onOrderChange,
  order,
  hasMore,
  isNextPageLoading,
  onLoadMore,
}: SecureNotesListProps) => {
  const { searchValue } = useSearchContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { openProtectedItemsUnlocker, areProtectedItemsUnlocked } =
    useProtectedItemsUnlocker();
  const { openDetailView } = useVaultItemDetailView();
  const isSearching = searchValue !== "";
  const openSecureNotesDetailView = (
    note: SecureNote,
    origin: VaultItemOrigin,
    listIndex?: number,
    listLength?: number
  ) => {
    const openNoteDetails = () => {
      logSelectVaultItem(
        note.id,
        ItemType.SecureNote,
        listIndex,
        listLength,
        origin === "suggested" ? Highlight.Suggested : Highlight.None
      );
      openDetailView(VaultItemType.SecureNote, note.id);
      if (isSearching) {
        SearchEventLogger.logSearchEvent();
      }
    };
    if (!areProtectedItemsUnlocked && note.isSecured) {
      return openProtectedItemsUnlocker({
        confirmLabelMode: ConfirmLabelMode.ShowNote,
        onSuccess: openNoteDetails,
        onError: () => {},
        onCancel: () => {},
        showNeverAskOption: false,
        credentialId: note.id,
      });
    } else {
      openNoteDetails();
    }
  };
  useIntersectionObserver({
    hasMore,
    bottomRef,
    loadMore: onLoadMore,
  });
  return (
    <div className={styles.listContent} ref={containerRef}>
      <SectionCard>
        <SectionListHeaderWithSort
          headerRef={headerRef}
          sortingOrder={order}
          onOrderChange={onOrderChange}
          credentialsCount={notesCount}
        />
        <SectionList
          aria-labelledby="tab-secure-notes"
          id="content-secure-notes"
        >
          {notes.map((note: SecureNote, index) => (
            <SecureNoteItem
              key={note.id}
              note={note}
              onOpenDetailsView={(
                secNote: SecureNote,
                origin: VaultItemOrigin
              ) => {
                if (isSearching) {
                  openSecureNotesDetailView(
                    secNote,
                    origin,
                    index + 1,
                    notes.length
                  );
                } else {
                  openSecureNotesDetailView(secNote, origin);
                }
              }}
              origin={isSearching ? "search" : "list"}
            />
          ))}
        </SectionList>
        <div ref={bottomRef}>
          {isNextPageLoading ? (
            <div className={styles.loader}>
              <LoaderIcon />
            </div>
          ) : null}
        </div>
      </SectionCard>
    </div>
  );
};
