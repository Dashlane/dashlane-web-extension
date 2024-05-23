import { memo } from 'react';
import { Credential } from '@dashlane/vault-contracts';
import { Button, jsx, Tooltip } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
import { logOpenCredentialUrl } from 'libs/logs/events/vault/open-external-vault-item-link';
import { QuickActionsMenu } from 'webapp/credentials/quick-actions-menu';
interface ListRowActionsProps {
    credentialItemRoute: string;
    credential: Credential;
}
const I18N_KEYS = {
    NO_WEBSITE_TOOLTIP: 'webapp_credentials_row_no_website_tooltip',
    OPEN_WEBSITE: 'webapp_credentials_row_open_website',
    ACTIONS_MENU: 'webapp_credentials_row_accessibility_actions_menu',
};
const ListRowActionsComponent = ({ credentialItemRoute, credential, }: ListRowActionsProps) => {
    const { translate } = useTranslate();
    const { id, URL } = credential;
    const openWebsiteDisabled = !URL;
    const noWebsiteLabel = translate(I18N_KEYS.NO_WEBSITE_TOOLTIP);
    const renderQuickActionsRoot = (toggle: () => void) => (<Button layout="iconOnly" intensity="quiet" mood="neutral" icon="ActionMoreOutlined" aria-label={translate(I18N_KEYS.ACTIONS_MENU)} onClick={toggle}/>);
    return (<div data-testid="quick-action-container" sx={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
      <div sx={{
            marginRight: '8px',
        }}>
        <Tooltip content={noWebsiteLabel} location="bottom" passThrough={!openWebsiteDisabled}>
          <Button title={translate(I18N_KEYS.OPEN_WEBSITE)} icon="ActionOpenExternalLinkOutlined" layout="iconLeading" mood="neutral" intensity="supershy" name="hiddenAction" role="link" onClick={() => {
            logOpenCredentialUrl(id, URL);
            openUrl(URL);
        }} aria-label={openWebsiteDisabled ? noWebsiteLabel : undefined} disabled={openWebsiteDisabled} sx={{
            opacity: '0',
            ':disabled': {
                cursor: 'not-allowed',
            },
        }}>
            {translate(I18N_KEYS.OPEN_WEBSITE)}
          </Button>
        </Tooltip>
      </div>
      <QuickActionsMenu credential={credential} credentialItemRoute={credentialItemRoute} renderRoot={renderQuickActionsRoot}/>
    </div>);
};
export const ListRowActions = memo(ListRowActionsComponent);
