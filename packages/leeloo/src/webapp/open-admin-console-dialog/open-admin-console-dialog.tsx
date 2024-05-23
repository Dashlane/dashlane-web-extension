import { Dialog, jsx, Paragraph } from '@dashlane/design-system';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
import { goToConsole } from 'libs/console';
import { useUserLogin } from 'libs/hooks/useUserLogin';
import { useOpenTeamConsole } from 'libs/hooks/use-open-team-console';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import { DOWNLOAD_DASHLANE, WEBAPP_CONSOLE } from 'team/urls';
const I18N_KEYS = {
    DIALOG_TITLE: 'open_admin_console_dialog_title',
    DIALOG_PARAGRAPH: 'open_admin_console_dialog_paragrah',
    DIALOG_PARAGRAPH_TWO: 'open_admin_console_dialog_paragrah_two',
    INSTALL_BUTTON: 'team_vault_navigation_dialog_install_cta',
    SKIP_RIGHT_NOW_BUTTON: 'open_admin_console_dialog_skip_btn',
    CLOSE: '_common_dialog_dismiss_button',
};
interface OpenAdminConsoleDialogProps {
    showAdminConsoleModal: boolean;
    setShowAdminConsoleModal: (isDialogShow: boolean) => void;
}
export const OpenAdminConsoleDialog = ({ showAdminConsoleModal, setShowAdminConsoleModal, }: OpenAdminConsoleDialogProps) => {
    const { translate } = useTranslate();
    const userLogin = useUserLogin() ?? '';
    const { openTeamConsole } = useOpenTeamConsole();
    const premiumStatusResponse = usePremiumStatus();
    const premiumStatus = premiumStatusResponse.status === DataStatus.Success
        ? premiumStatusResponse.data
        : undefined;
    const handleSkipNow = () => {
        if (premiumStatus) {
            goToConsole(userLogin, premiumStatus, openTeamConsole);
        }
        else {
            openUrl(WEBAPP_CONSOLE);
        }
        setShowAdminConsoleModal(false);
    };
    const handleInstallClick = () => {
        openUrl(DOWNLOAD_DASHLANE);
    };
    return (<Dialog isOpen={showAdminConsoleModal} title={translate(I18N_KEYS.DIALOG_TITLE)} actions={{
            primary: {
                children: translate(I18N_KEYS.INSTALL_BUTTON),
                onClick: handleInstallClick,
                icon: 'ActionOpenExternalLinkOutlined',
                layout: 'iconTrailing',
            },
            secondary: {
                children: translate(I18N_KEYS.SKIP_RIGHT_NOW_BUTTON),
                onClick: handleSkipNow,
            },
        }} closeActionLabel={translate(I18N_KEYS.CLOSE)} onClose={() => setShowAdminConsoleModal(false)}>
      <Paragraph color="ds.text.neutral.standard">
        {translate(I18N_KEYS.DIALOG_PARAGRAPH)}
      </Paragraph>
      <Paragraph color="ds.text.neutral.standard">
        {translate(I18N_KEYS.DIALOG_PARAGRAPH_TWO)}
      </Paragraph>
    </Dialog>);
};
