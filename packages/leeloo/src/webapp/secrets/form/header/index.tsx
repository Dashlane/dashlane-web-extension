import { Icon, jsx } from '@dashlane/design-system';
import { Props as TabProps } from 'libs/dashlane-style/tabs/tab';
import { SecretsTabs } from 'webapp/secrets/edit/types';
import useTranslate from 'libs/i18n/useTranslate';
import { PanelHeader } from 'webapp/panel';
import { TitleField } from 'webapp/secrets/edit/title-field/title-field';
const { CONTENT, MORE_OPTIONS, SHARED_ACCESS } = SecretsTabs;
interface Props {
    activeTab: SecretsTabs;
    disabled?: boolean;
    setActiveTab: (tab: SecretsTabs) => void;
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
    TAB_TITLE_DETAILS_EDITION: 'webapp_secrets_edition_field_tab_title_details',
    TAB_TITLE_SHARED_ACCESS_EDITION: 'webapp_secure_notes_edition_field_tab_title_shared_access',
    TAB_TITLE_ATTACHMENTS_TOOLTIPS: 'webapp_secure_notes_edition_field_tab_title_attachments_tooltips',
    TAB_TITLE_ATTACHMENTS_EDITION: 'webapp_secure_notes_edition_field_tab_title_attachments',
    TAB_TITLE_OPTIONS_EDITION: 'webapp_secure_notes_edition_field_tab_title_options',
};
export const Header = ({ activeTab, setActiveTab, disabled, displaySharedAccess, recipientsCount, title, setTitle, }: WithSharedAccessProps | WithoutSharedAccessProps) => {
    const { translate } = useTranslate();
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
    tabs.push({
        active: activeTab === MORE_OPTIONS,
        label: translate(I18N_KEYS.TAB_TITLE_OPTIONS_EDITION),
        onClick: () => setActiveTab(MORE_OPTIONS),
    });
    return (<PanelHeader icon={<Icon name="RecoveryKeyOutlined" color="ds.text.neutral.standard"/>} title={<TitleField title={title} disabled={disabled} onChange={(e) => setTitle(e.target.value)}/>} tabs={tabs}/>);
};
