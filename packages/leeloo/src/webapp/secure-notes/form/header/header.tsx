import { NoteType } from "@dashlane/communication";
import { NotesIcon } from "@dashlane/ui-components";
import TooltipModern from "../../../../libs/dashlane-style/tooltip-modern";
import { SecureNoteTabs } from "../../edit/types";
import getBackgroundColorForNoteType from "../../../note-icon/getBackgroundColorForNoteType";
import { LockedItemType } from "../../../unlock-items/types";
import { logUserEventAskAuthentication } from "../../../unlock-items";
import { PanelHeader } from "../../../panel";
import { TitleField } from "../../edit/title-field/title-field";
import { useProtectedItemsUnlocker } from "../../../unlock-items/useProtectedItemsUnlocker";
import useTranslate from "../../../../libs/i18n/useTranslate";
import styles from "./styles.css";
const { CONTENT, DOCUMENT_STORAGE, MORE_OPTIONS, SHARED_ACCESS } =
  SecureNoteTabs;
interface Props {
  attachmentsCount?: number;
  backgroundColor: NoteType;
  disabled?: boolean;
  displayDocumentStorage: boolean;
  displayMoreOptions: boolean;
  isSecured: boolean;
  setActiveTab: (tab: SecureNoteTabs) => void;
  title: string;
  setTitle: (title: string) => void;
}
export interface TabProps {
  id: string;
  title: string;
  contentId: string;
  onSelect: () => void;
  tabIconElement?: JSX.Element;
}
interface WithSharedAccessProps extends Props {
  displaySharedAccess: true;
  recipientsCount: number;
}
interface WithoutSharedAccessProps extends Props {
  displaySharedAccess: false;
  recipientsCount?: number;
}
const I18N_KEYS = {
  TAB_TITLE_DETAILS_EDITION:
    "webapp_secure_notes_edition_field_tab_title_details",
  TAB_TITLE_SHARED_ACCESS_EDITION:
    "webapp_secure_notes_edition_field_tab_title_shared_access",
  TAB_TITLE_ATTACHMENTS_TOOLTIPS:
    "webapp_secure_notes_edition_field_tab_title_attachments_tooltips",
  TAB_TITLE_ATTACHMENTS_EDITION:
    "webapp_secure_notes_edition_field_tab_title_attachments",
  TAB_TITLE_OPTIONS_EDITION:
    "webapp_secure_notes_edition_field_tab_title_options",
};
export const Header = ({
  attachmentsCount,
  setActiveTab,
  backgroundColor,
  disabled,
  displayDocumentStorage,
  displaySharedAccess,
  displayMoreOptions,
  isSecured,
  recipientsCount,
  title,
  setTitle,
}: WithSharedAccessProps | WithoutSharedAccessProps) => {
  const { translate } = useTranslate();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const tabs: TabProps[] = [
    {
      id: "tab-note-detail",
      contentId: "content-note-detail",
      title: translate(I18N_KEYS.TAB_TITLE_DETAILS_EDITION),
      onSelect: () => setActiveTab(CONTENT),
    },
  ];
  const onSelectStorageTab = () => {
    if (!areProtectedItemsUnlocked && isSecured) {
      logUserEventAskAuthentication();
      openProtectedItemsUnlocker({
        itemType: LockedItemType.SecureNoteSetting,
        successCallback: () => setActiveTab(DOCUMENT_STORAGE),
      });
    } else {
      setActiveTab(DOCUMENT_STORAGE);
    }
  };
  if (displaySharedAccess) {
    tabs.push({
      id: "tab-shared-access",
      contentId: "content-shared-access",
      title: `${translate(
        I18N_KEYS.TAB_TITLE_SHARED_ACCESS_EDITION
      )} (${recipientsCount})`,
      onSelect: () => setActiveTab(SHARED_ACCESS),
    });
  }
  if (displayDocumentStorage) {
    const tabIconElement = (
      <TooltipModern>
        <p>{translate(I18N_KEYS.TAB_TITLE_ATTACHMENTS_TOOLTIPS)}</p>
      </TooltipModern>
    );
    const countSuffix = attachmentsCount ? ` (${attachmentsCount})` : "";
    tabs.push({
      id: "tab-document-storage",
      contentId: "content-document-storage",
      title: `${translate(
        I18N_KEYS.TAB_TITLE_ATTACHMENTS_EDITION
      )}${countSuffix}`,
      onSelect: onSelectStorageTab,
      tabIconElement: tabIconElement,
    });
  }
  if (displayMoreOptions) {
    tabs.push({
      id: "tab-more-options",
      contentId: "content-more-options",
      title: translate(I18N_KEYS.TAB_TITLE_OPTIONS_EDITION),
      onSelect: () => setActiveTab(MORE_OPTIONS),
    });
  }
  return (
    <PanelHeader
      icon={
        <div className={styles.iconWrapper}>
          <NotesIcon size={40} color={"white"} />
        </div>
      }
      iconBackgroundColor={getBackgroundColorForNoteType(backgroundColor)}
      title={
        <TitleField
          title={title}
          disabled={disabled}
          onChange={(e) => setTitle(e.target.value)}
        />
      }
      tabs={tabs}
    />
  );
};
