import { useContext } from 'react';
import { Button, jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { redirectToUrl } from 'libs/external-urls';
import { ShowVaultNavModalContext } from 'team/show-vault-nav-modal/show-vault-nav-modal-provider';
import { WEBAPP_BASE } from 'team/urls';
const I18N_KEYS = {
    OPEN_VAULT_BUTTON: 'webapp_sidemenu_open_vault_cta',
};
interface Props {
    isCollapsed: boolean;
}
export const BottomButton = ({ isCollapsed }: Props) => {
    const { translate } = useTranslate();
    const { setIsVaultNavigationModalOpen } = useContext(ShowVaultNavModalContext);
    const handleClickOnOpenVault = () => {
        if (!APP_PACKAGED_IN_EXTENSION) {
            setIsVaultNavigationModalOpen(true);
        }
        else {
            redirectToUrl(WEBAPP_BASE);
        }
    };
    return (<div sx={{
            display: 'flex',
            justifyContent: 'center',
            borderTop: '1px solid',
            position: 'fixed',
            bottom: '0',
            borderTopColor: 'ds.border.neutral.quiet.idle',
            backgroundColor: 'ds.container.agnostic.inverse.standard',
            width: isCollapsed ? '96px' : '256px',
        }}>
      <Button layout={isCollapsed ? 'iconOnly' : 'iconLeading'} aria-label={translate(I18N_KEYS.OPEN_VAULT_BUTTON)} fullsize={!isCollapsed} sx={{ margin: '20px 25px' }} icon="VaultOutlined" mood="brand" intensity="catchy" onClick={handleClickOnOpenVault}>
        {translate(I18N_KEYS.OPEN_VAULT_BUTTON)}
      </Button>
    </div>);
};
