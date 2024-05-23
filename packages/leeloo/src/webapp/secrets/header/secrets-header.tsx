import { jsx } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import useTranslate from 'libs/i18n/useTranslate';
import { useHistory, useRouterGlobalSettingsContext } from 'libs/router';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { VaultHeader } from 'webapp/components/header/vault-header';
import { getDefaultSharing } from 'webapp/sharing-invite/helpers';
import { SharingButton } from 'webapp/sharing-invite/sharing-button';
import { ItemsTabs } from 'webapp/sharing-invite/types';
import { useShareableSecretsCount } from 'webapp/sharing-invite/hooks/useItemsCount';
import { useSecretsCount } from '../hooks/use-secrets-count';
import { Origin } from '@dashlane/hermes';
const I18N_KEYS = {
    SHARE: 'credentials_header_share_password',
    UI_TOOLTIP: 'webapp_secure_notes_header_add_ui_tooltip',
    TOOLTIP: 'webapp_secure_notes_header_add_tooltip',
};
export const SecretsHeader = () => {
    const shareableSecretsCount = useShareableSecretsCount();
    const totalSecretsCount = useSecretsCount();
    const premiumStatus = usePremiumStatus();
    const history = useHistory();
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const isLoading = premiumStatus.status !== DataStatus.Success ||
        totalSecretsCount === null ||
        shareableSecretsCount === null;
    if (isLoading) {
        return null;
    }
    const getShareActionLocal = () => {
        const hasShareableSecrets = shareableSecretsCount > 0;
        if (!hasShareableSecrets) {
            return null;
        }
        const sharing = {
            ...getDefaultSharing(),
            tab: ItemsTabs.Secrets,
        };
        return (<SharingButton sharing={sharing} text={translate(I18N_KEYS.SHARE)} origin={Origin.ItemListView}/>);
    };
    const onClickAddNew = () => {
        history.push(routes.userAddBlankSecret);
    };
    const shareButton = getShareActionLocal();
    return (<VaultHeader tooltipPassThrough={true} tooltipContent={translate(I18N_KEYS.UI_TOOLTIP)} handleAddNew={onClickAddNew} shareButtonElement={shareButton} shouldDisplayNewAccountImportButton={!!totalSecretsCount} shouldDisplayAddButton={!!totalSecretsCount}/>);
};
