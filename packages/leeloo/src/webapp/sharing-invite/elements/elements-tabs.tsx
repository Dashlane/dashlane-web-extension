import { HorizontalNavButton, HorizontalNavMenu, jsx, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useCredentialsCount, useShareableNotesCount, useShareableSecretsCount, } from 'webapp/sharing-invite/hooks/useItemsCount';
import { ItemsTabs } from '../types';
const I18N_KEYS = {
    NOTES: 'webapp_sharing_invite_secure_notes',
    PASSWORDS: 'webapp_sharing_invite_passwords',
    SECRETS: 'webapp_sharing_invite_secrets',
};
export interface ElementsStepTabsProps {
    selectNotesTab: () => void;
    selectPasswordsTab: () => void;
    selectSecretsTab: () => void;
    selectedCredentials: string[];
    selectedNotes: string[];
    selectedSecrets: string[];
    tab: ItemsTabs;
}
const buildTabConfig = (onClick: () => void, isActive: boolean, prefix: string, suffix: string): {
    onClick: () => void;
    active: boolean;
    label: string;
} => ({
    onClick: onClick,
    active: isActive,
    label: `${prefix}${suffix}`,
});
export const ElementsStepTabs = ({ selectNotesTab, selectPasswordsTab, selectSecretsTab, selectedCredentials, selectedNotes, selectedSecrets, tab, }: ElementsStepTabsProps) => {
    const { translate } = useTranslate();
    const credentialsCount = useCredentialsCount();
    const notesCount = useShareableNotesCount();
    const secretsCount = useShareableSecretsCount();
    if (!credentialsCount || !notesCount || !secretsCount) {
        return null;
    }
    const tabs = [
        buildTabConfig(selectPasswordsTab, tab === ItemsTabs.Passwords, translate(I18N_KEYS.PASSWORDS), selectedCredentials.length > 0 ? ` (${selectedCredentials.length})` : ''),
        buildTabConfig(selectNotesTab, tab === ItemsTabs.SecureNotes, translate(I18N_KEYS.NOTES), selectedNotes.length > 0 ? ` (${selectedNotes.length})` : ''),
        buildTabConfig(selectSecretsTab, tab === ItemsTabs.Secrets, translate(I18N_KEYS.SECRETS), selectedSecrets.length > 0 ? ` (${selectedSecrets.length})` : ''),
    ];
    return (<HorizontalNavMenu>
      {tabs.map(({ active, label, onClick }) => (<HorizontalNavButton key={label} label={label} onClick={onClick} selected={active}/>))}
    </HorizontalNavMenu>);
};
