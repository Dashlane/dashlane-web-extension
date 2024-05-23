import { jsx } from '@dashlane/design-system';
import { NoteType } from '@dashlane/communication';
import { NotesIcon } from '@dashlane/ui-components';
import { Props as TabProps } from 'libs/dashlane-style/tabs/tab';
import TooltipModern from 'libs/dashlane-style/tooltip-modern';
import { SecureNoteTabs } from 'webapp/secure-notes/edit/types';
import getBackgroundColorForNoteType from 'webapp/note-icon/getBackgroundColorForNoteType';
import useTranslate from 'libs/i18n/useTranslate';
import { useIsSecureNoteAttachmentEnabled } from 'webapp/secure-files/hooks';
import { PanelHeader } from 'webapp/panel';
import { TitleField } from 'webapp/secure-notes/edit/title-field/title-field';
import styles from './styles.css';
const { CONTENT, DOCUMENT_STORAGE, MORE_OPTIONS, SHARED_ACCESS } = SecureNoteTabs;
interface Props {
    activeTab: SecureNoteTabs;
    backgroundColor: NoteType;
    disabled?: boolean;
    displayDocumentStorage: boolean;
    setActiveTab: (tab: SecureNoteTabs) => void;
    title: string;
    setTitle: (title: string) => void;
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
    TAB_TITLE_DETAILS_EDITION: 'webapp_secure_notes_edition_field_tab_title_details',
    TAB_TITLE_SHARED_ACCESS_EDITION: 'webapp_secure_notes_edition_field_tab_title_shared_access',
    TAB_TITLE_ATTACHMENTS_TOOLTIPS: 'webapp_secure_notes_edition_field_tab_title_attachments_tooltips',
    TAB_TITLE_ATTACHMENTS_EDITION: 'webapp_secure_notes_edition_field_tab_title_attachments',
    TAB_TITLE_OPTIONS_EDITION: 'webapp_secure_notes_edition_field_tab_title_options',
};
export const Header = ({ activeTab, setActiveTab, backgroundColor, disabled, displayDocumentStorage, displaySharedAccess, recipientsCount, title, setTitle, }: WithSharedAccessProps | WithoutSharedAccessProps) => {
    const { translate } = useTranslate();
    const isSecureNoteAttachmentAvailable = useIsSecureNoteAttachmentEnabled();
    const tabs: TabProps[] = [
        {
            active: activeTab === CONTENT,
            label: translate(I18N_KEYS.TAB_TITLE_DETAILS_EDITION),
            onClick: () => setActiveTab(CONTENT),
        },
    ];
    if (displaySharedAccess) {
        tabs.push({
            active: activeTab === SHARED_ACCESS,
            label: `${translate(I18N_KEYS.TAB_TITLE_SHARED_ACCESS_EDITION)} (${recipientsCount})`,
            onClick: () => setActiveTab(SHARED_ACCESS),
        });
    }
    if (displayDocumentStorage) {
        const tabIconElement = !isSecureNoteAttachmentAvailable ? (<TooltipModern>
        <p>{translate(I18N_KEYS.TAB_TITLE_ATTACHMENTS_TOOLTIPS)}</p>
      </TooltipModern>) : undefined;
        tabs.push({
            active: activeTab === DOCUMENT_STORAGE,
            label: translate(I18N_KEYS.TAB_TITLE_ATTACHMENTS_EDITION),
            onClick: () => setActiveTab(DOCUMENT_STORAGE),
            tabIconElement: tabIconElement,
        });
    }
    tabs.push({
        active: activeTab === MORE_OPTIONS,
        label: translate(I18N_KEYS.TAB_TITLE_OPTIONS_EDITION),
        onClick: () => setActiveTab(MORE_OPTIONS),
    });
    return (<PanelHeader icon={<div className={styles.iconWrapper}>
          <NotesIcon size={40} color={'white'}/>
        </div>} iconBackgroundColor={getBackgroundColorForNoteType(backgroundColor)} title={<TitleField title={title} disabled={disabled} onChange={(e) => setTitle(e.target.value)}/>} tabs={tabs}/>);
};
