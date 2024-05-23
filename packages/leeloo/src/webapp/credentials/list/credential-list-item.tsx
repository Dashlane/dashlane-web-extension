import { memo } from 'react';
import { fromUnixTime } from 'date-fns';
import { Checkbox, jsx, Tooltip } from '@dashlane/design-system';
import { Credential, VaultItemType } from '@dashlane/vault-contracts';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { sharingItemsApi } from '@dashlane/sharing-contracts';
import { PageView } from '@dashlane/hermes';
import LocalizedTimeAgo from 'libs/i18n/localizedTimeAgo';
import IntelligentTooltipOnOverflow from 'libs/dashlane-style/intelligent-tooltip-on-overflow';
import { useLocation, useRouterGlobalSettingsContext } from 'libs/router';
import { logPageView } from 'libs/logs/logEvent';
import { logSelectCredential } from 'libs/logs/events/vault/select-item';
import useTranslate from 'libs/i18n/useTranslate';
import { useMultiselectContext, useMultiselectUpdateContext, } from './multi-select/multi-select-context';
import { CredentialTitle } from 'webapp/credentials/list/credential-title';
import { ListRowActions } from 'webapp/credentials/list/list-row-actions';
import { SX_STYLES } from 'webapp/credentials/style';
import Row from 'webapp/list-view/row';
import { useCompromisedCredentialsContext } from '../credentials-view/compromised-credentials-context';
import { VaultRowItemCollectionsList } from './collections';
const I18N_KEYS = {
    DISABLED_CHECKBOX_TOOLTIP: 'webapp_multiselect_disabled_checkbox_tooltip',
    LAST_USED_NEVER: 'webapp_credentials_row_last_used_never',
};
interface CredentialListItemProps {
    credential: Credential;
    onSelectCredential: (item: Credential) => void;
}
interface CredentialRowProps extends CredentialListItemProps {
    isSelected: boolean;
    isShared: boolean;
}
interface TitleProps {
    credential: Credential;
    isShared: boolean;
}
const Title = ({ credential, isShared }: TitleProps) => {
    const { isCredentialCompromised } = useCompromisedCredentialsContext();
    return (<CredentialTitle credential={credential} isShared={isShared} isCompromised={isCredentialCompromised(credential.id)}/>);
};
const CredentialRow = memo(({ credential, onSelectCredential, isSelected, isShared, }: CredentialRowProps) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const { pathname } = useLocation();
    const credentialItemRoute = routes.userVaultItem(credential.id, VaultItemType.Credential, pathname);
    const onRowClick = () => {
        logPageView(PageView.ItemCredentialDetails);
        logSelectCredential(credential.id);
    };
    return (<Row link={credentialItemRoute} type={'link'} selected={isSelected} onClick={onRowClick} checkable={<Tooltip passThrough={!isShared} location="right" content={translate(I18N_KEYS.DISABLED_CHECKBOX_TOOLTIP)} sx={{
                maxWidth: '200px',
                whiteSpace: 'normal',
            }}>
            <span sx={{ marginRight: '16px' }}>
              <Checkbox aria-label={credential.URL !== '' ? credential.URL : credential.username} sx={{ position: 'relative', gap: '0' }} checked={isSelected} onChange={() => onSelectCredential(credential)} readOnly={isShared}/>
            </span>
          </Tooltip>} data={[
            {
                key: 'title',
                content: <Title credential={credential} isShared={isShared}/>,
            },
            {
                key: 'lastUse',
                content: (<IntelligentTooltipOnOverflow>
                {credential.lastUse ? (<LocalizedTimeAgo date={fromUnixTime(credential.lastUse)}/>) : (translate(I18N_KEYS.LAST_USED_NEVER))}
              </IntelligentTooltipOnOverflow>),
                sxProps: SX_STYLES.LAST_USE_CELL,
            },
            {
                key: 'collection',
                content: (<VaultRowItemCollectionsList vaultItemId={credential.id}/>),
                sxProps: SX_STYLES.CATEGORY_CELL,
            },
        ]} actions={<ListRowActions credentialItemRoute={credentialItemRoute} credential={credential}/>}/>);
});
export const CredentialListItem = ({ credential, ...rest }: CredentialListItemProps) => {
    const { selectedItems } = useMultiselectContext();
    const { toggleSelectItem } = useMultiselectUpdateContext();
    const { data, status } = useModuleQuery(sharingItemsApi, 'getSharingStatusForItem', {
        itemId: credential.id,
    });
    if (status !== DataStatus.Success) {
        return null;
    }
    const { isShared } = data;
    const isSelected = selectedItems.some((selectedItem) => selectedItem.id === credential.id);
    if (isSelected && isShared) {
        toggleSelectItem(credential);
        return null;
    }
    return (<CredentialRow credential={credential} isShared={isShared} isSelected={isSelected} {...rest}/>);
};
