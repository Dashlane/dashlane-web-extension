import { jsx } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/framework-react';
import { ParsedURL } from '@dashlane/url-parser';
import { Credential } from '@dashlane/vault-contracts';
import { CredentialInfoSize } from 'libs/dashlane-style/credential-info/credential-info';
import { CredentialThumbnail } from 'libs/dashlane-style/credential-info/credential-thumbnail';
import useTranslate from 'libs/i18n/useTranslate';
import { CredentialTabs } from 'webapp/credentials/edit/types';
import { PanelHeader } from 'webapp/panel';
import { useSharedAccessData } from 'webapp/shared-access/hooks/use-shared-access-data';
const { SHARED_ACCESS, ACCOUNT_DETAILS } = CredentialTabs;
export interface Props {
    activeTab: CredentialTabs;
    credential: Credential;
    displayTabs: boolean;
    onAutoChange?: () => void;
    onShare?: () => void;
    changeTab: (newActiveTab: CredentialTabs) => void;
}
export const EditHeader = ({ activeTab, credential, displayTabs, changeTab, }: Props) => {
    const { translate } = useTranslate();
    const { data, status } = useSharedAccessData(credential.id);
    const sharedCount = status === DataStatus.Success ? data.count : 0;
    const tabs = [
        {
            active: activeTab === ACCOUNT_DETAILS,
            label: translate('webapp_credential_edition_account_details'),
            onClick: () => changeTab(ACCOUNT_DETAILS),
        },
        {
            active: activeTab === SHARED_ACCESS,
            label: `${translate('webapp_credential_edition_shared_access')} (${sharedCount})`,
            onClick: () => changeTab(SHARED_ACCESS),
        },
    ];
    return (<PanelHeader icon={<CredentialThumbnail title={credential.itemName} size={CredentialInfoSize.LARGE} domain={new ParsedURL(credential.URL).getRootDomain()}/>} title={credential.itemName} tabs={displayTabs ? tabs : undefined}/>);
};
