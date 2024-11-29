import { SecureNote } from "@dashlane/vault-contracts";
import { SecureNotesHeader } from "../header/secure-notes-header";
import { NoteRow } from "./note-row";
import { NotesEmptyView } from "./notes-empty-view";
import { SecureNotesListViewHeader } from "./secure-notes-list-view-header";
import { useSecureNotesContext } from "../secure-notes-view/secure-notes-context";
import { InfiniteScrollList } from "../../pagination/infinite-scroll-list";
import { WithBaseLayout, WithLayoutProps } from "../../layout/with-layout";
import {
  UpgradeNoticeBanner,
  UpgradeNoticeType,
} from "../../credentials/header/upgrade-notice-banner";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { EmptyStateHeader } from "../../empty-state/shared/empty-state-header";
import { useFeatureFlip } from "@dashlane/framework-react";
import { SecureNotesEmptyState } from "../empty-state/secure-notes-empty-state";
const I18N_KEYS = {
  EMPTY_STATE_PAGE_TITLE: "webapp_secure_notes_empty_state_page_title",
};
export const SecureNotesListView = ({ withLayout = true }: WithLayoutProps) => {
  const { secureNotes, hasMore, onNextPage } = useSecureNotesContext();
  const emptyStateBatch1FeatureFlip = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.EmptyStateBatch1
  );
  if (!secureNotes?.length) {
    return (
      <WithBaseLayout
        withLayout={withLayout}
        header={
          emptyStateBatch1FeatureFlip ? (
            <EmptyStateHeader title={I18N_KEYS.EMPTY_STATE_PAGE_TITLE} />
          ) : (
            <SecureNotesHeader />
          )
        }
      >
        {emptyStateBatch1FeatureFlip ? (
          <SecureNotesEmptyState />
        ) : (
          <NotesEmptyView />
        )}
      </WithBaseLayout>
    );
  }
  return (
    <WithBaseLayout withLayout={withLayout} header={<SecureNotesHeader />}>
      <div
        sx={{
          position: "relative",
          height: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <UpgradeNoticeBanner
          customSx={{ marginBottom: "8px" }}
          noticeType={UpgradeNoticeType.SecureNotes}
        />
        <SecureNotesListViewHeader />

        <div
          sx={{
            height: "100%",
            overflow: "hidden",
          }}
        >
          <InfiniteScrollList onNextPage={onNextPage} hasMore={hasMore}>
            {secureNotes.map((secureNote: SecureNote) => (
              <NoteRow
                key={`secureNotes_list_secureNoteId_${secureNote.id}`}
                note={secureNote}
              />
            ))}
          </InfiniteScrollList>
        </div>
      </div>
    </WithBaseLayout>
  );
};
