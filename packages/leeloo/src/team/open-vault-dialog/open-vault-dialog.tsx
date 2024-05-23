import { Fragment } from 'react';
import { Icon, jsx, Paragraph } from '@dashlane/design-system';
import { Dialog, DialogBody, DialogFooter, DialogTitle, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
import { redirect } from 'libs/router';
import { DOWNLOAD_DASHLANE, WEBAPP_LOGIN } from 'team/urls';
import { logInstallEvent, logNavigateAwayEvent, logSkipNowEvent } from './logs';
const I18N_KEYS = {
    DIALOG_TITLE: 'team_vault_navigation_dialog_title',
    DIALOG_PARAGRAPH: 'team_vault_navigation_dialog_paragrah',
    DIALOG_PARAGRAPH_TWO: 'team_vault_navigation_dialog_paragrah_two',
    INSTALL_BUTTON: 'team_vault_navigation_dialog_install_cta',
    SKIP_RIGHT_NOW_BUTTON: 'team_vault_navigation_dialog_skip_btn',
    CLOSE: '_common_dialog_dismiss_button',
};
interface OpenVaultNavigationDialogProps {
    showVaultNavigationModal: boolean;
    setShowVaultNavigationModal: (isModalShow: boolean) => void;
    onBeforeNavigate?: () => void;
}
export const OpenVaultNavigationDialog = ({ showVaultNavigationModal, setShowVaultNavigationModal, onBeforeNavigate, }: OpenVaultNavigationDialogProps) => {
    const { translate } = useTranslate();
    const handleSkipNow = () => {
        logSkipNowEvent();
        onBeforeNavigate?.();
        if (APP_PACKAGED_IN_EXTENSION) {
            redirect('/');
        }
        else {
            openUrl(WEBAPP_LOGIN);
        }
        setShowVaultNavigationModal(false);
    };
    const handleInstallClick = () => {
        logInstallEvent();
        onBeforeNavigate?.();
        openUrl(DOWNLOAD_DASHLANE);
    };
    const handleUserClickAway = () => {
        logNavigateAwayEvent();
        setShowVaultNavigationModal(false);
    };
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={showVaultNavigationModal} onClose={handleUserClickAway}>
      <DialogTitle title={<span color="ds.text.neutral.catchy" sx={{
                margin: '0px 15px',
                fontSize: '25px',
                fontWeight: '800',
                display: 'block',
            }}>
            {translate(I18N_KEYS.DIALOG_TITLE)}
          </span>}/>
      <DialogBody>
        <Paragraph sx={{ margin: '15px', fontSiz: '16px' }} color="ds.text.neutral.standard">
          {translate(I18N_KEYS.DIALOG_PARAGRAPH)}
        </Paragraph>
        <Paragraph sx={{ margin: '15px', fontSiz: '16px' }} color="ds.text.neutral.standard">
          {translate(I18N_KEYS.DIALOG_PARAGRAPH_TWO)}
        </Paragraph>
      </DialogBody>
      <DialogFooter primaryButtonTitle={<>
            <span sx={{ marginRight: '8px' }}>
              {translate(I18N_KEYS.INSTALL_BUTTON)}
            </span>
            <Icon name="ActionOpenExternalLinkOutlined" size="small" color="ds.text.inverse.catchy"/>
          </>} primaryButtonOnClick={handleInstallClick} primaryButtonProps={{ type: 'button' }} secondaryButtonTitle={translate(I18N_KEYS.SKIP_RIGHT_NOW_BUTTON)} secondaryButtonOnClick={handleSkipNow}/>
    </Dialog>);
};
