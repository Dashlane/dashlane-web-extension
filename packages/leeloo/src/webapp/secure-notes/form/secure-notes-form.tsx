import { NoteType } from "@dashlane/communication";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { NoteColors } from "@dashlane/vault-contracts";
import { useHasFeatureEnabled } from "../../../libs/carbon/hooks/useHasFeature";
import { SharedAccess } from "../../shared-access";
import { SaveSecureNoteContentValues } from "../../personal-data/types";
import { SecureNoteTabs } from "../edit/types";
import { SecureNoteContentForm } from "./secure-note-content-form";
import { FieldCollection } from "../../credentials/form/collections-field/collections-field-context";
import { EmbeddedAttachmentsForm } from "../../secure-files/components/embedded-attachments-form";
import { ItemType } from "@dashlane/hermes";
const { CONTENT, DOCUMENT_STORAGE, SHARED_ACCESS } = SecureNoteTabs;
export interface Props {
  activeTab: SecureNoteTabs;
  data: SaveSecureNoteContentValues;
  content: string;
  title: string;
  color: string;
  spaceId: string;
  onSpaceIdChange: (newSpaceId: string) => void;
  onColorChange: (newColor: NoteColors) => void;
  onTitleChange: (newTitle: string) => void;
  onContentChange: (content: string) => void;
  onIsSecuredChange: (newBool: boolean) => void;
  onIsSubmitDisabled: (newBool: boolean) => void;
  handleFileInfoDetached: (secureFileInfoId: string) => void;
  hasAttachment: boolean;
  isDisabled: boolean;
  isSecured: boolean;
  isAdmin: boolean;
  isShared: boolean;
  isUploading: boolean;
  onModifyData: () => void;
  onModalDisplayStateChange?: (isModalOpen: boolean) => void;
  onCollectionsToUpdate: (collectionsToUpdate: FieldCollection[]) => void;
  setHasDialogsOpenedByChildren: (isDialogOpen: boolean) => void;
}
export interface State {
  headerBackground: NoteType;
  textSize: number;
}
export const SecureNotesForm = ({
  activeTab,
  data,
  content,
  handleFileInfoDetached,
  hasAttachment,
  isAdmin,
  isShared,
  isUploading,
  isDisabled,
  onModifyData,
  onModalDisplayStateChange,
  setHasDialogsOpenedByChildren,
  ...props
}: Props) => {
  const isDisableSecureNotesFFActive = useHasFeatureEnabled(
    FEATURE_FLIPS_WITHOUT_MODULE.DisableSecureNotes
  );
  return (
    <>
      <div aria-labelledby="tab-note-detail" id="content-note-detail">
        {activeTab === CONTENT && (
          <SecureNoteContentForm
            data={data}
            content={content}
            isNewItem={false}
            isAdmin={isAdmin}
            isShared={isShared}
            isDisabled={isDisabled}
            isDisableSecureNotesFFActive={isDisableSecureNotesFFActive}
            hasAttachment={hasAttachment}
            onModifyData={onModifyData}
            setHasDialogsOpenedByChildren={setHasDialogsOpenedByChildren}
            {...props}
          />
        )}
      </div>

      {activeTab === SHARED_ACCESS && (
        <div aria-labelledby="tab-shared-access" id="content-shared-access">
          <SharedAccess isAdmin={isAdmin} id={data.id} />
        </div>
      )}

      {activeTab === DOCUMENT_STORAGE && (
        <div
          aria-labelledby="tab-document-storage"
          id="content-document-storage"
        >
          <EmbeddedAttachmentsForm
            attachments={data.attachments}
            additionalProps={{
              itemId: data.id,
              itemType: ItemType.SecureNote,
              handleFileInfoDetached: (secureFileInfoId: string) => {
                handleFileInfoDetached(secureFileInfoId);
              },
              onModalDisplayStateChange,
              isUploading: isUploading,
            }}
          />
        </div>
      )}
    </>
  );
};
