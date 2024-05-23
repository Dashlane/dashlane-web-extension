import { Button, colors, jsx, OpenWebsiteIcon, Paragraph, ThemeUIStyleObject, Tooltip, } from '@dashlane/ui-components';
import { NotificationName, VpnAccountStatusType, } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
import { os } from '@dashlane/browser-utils';
import { useNotificationSeen } from 'libs/carbon/hooks/useNotificationStatus';
import { TutorialStep, TutorialStepStatus } from './tutorial-step';
import { HOTSPOTSHIELD_INSTALL_URL, HOTSPOTSHIELD_INSTALL_URL_MAP, OPEN_IN_NEW_TAB, } from './vpn-links-constants';
import { TutorialStepNumberProp } from './types';
import { TutorialStepWrapper } from './tutorial-step-wrapper';
import { logUserDownloadVpnClient } from '../logs';
const I18N_KEYS = {
    ACCESS: {
        HEADING: 'webapp_vpn_page_access_hotspotshield_heading',
        TEXT: 'webapp_vpn_page_access_hotspotshield_text_markup',
    },
    INSTALL: {
        BUTTON: 'webapp_vpn_page_install_hotspotshield_button',
        BUTTON_INFOBOX: 'webapp_vpn_page_install_hotspotshield_button_infobox_message',
        HEADING: 'webapp_vpn_page_install_hotspotshield_heading',
        TEXT: 'webapp_vpn_page_install_hotspotshield_text',
    },
};
const DOWNLOAD_URL = HOTSPOTSHIELD_INSTALL_URL_MAP[os.getOSName() ?? ''] ??
    HOTSPOTSHIELD_INSTALL_URL;
const disableButton: ThemeUIStyleObject = {
    opacity: '0.6',
    cursor: 'not-allowed',
    '&:hover:enabled': {
        backgroundColor: `${colors.midGreen00}`,
        borderColor: `${colors.midGreen00}`,
    },
    '&:focus': {
        backgroundColor: `${colors.midGreen00}`,
        borderColor: `${colors.midGreen00}`,
    },
};
export const VpnInstallHotspotshield = ({ stepNumber, vpnCredential, }: TutorialStepNumberProp) => {
    const { translate } = useTranslate();
    const { unseen, setAsSeen } = useNotificationSeen(NotificationName.VpnHostpotshieldInstalled);
    const onClickGetTheAppButton = () => {
        setAsSeen();
        logUserDownloadVpnClient();
        openUrl(DOWNLOAD_URL);
    };
    if (unseen === null) {
        return null;
    }
    const title = translate(unseen ? I18N_KEYS.INSTALL.HEADING : I18N_KEYS.ACCESS.HEADING);
    const status = unseen
        ? TutorialStepStatus.INITIAL
        : TutorialStepStatus.COMPLETED;
    const canDownloadApp = vpnCredential &&
        (vpnCredential.status === VpnAccountStatusType.Ready ||
            vpnCredential.status === VpnAccountStatusType.Activated);
    return (<TutorialStepWrapper>
      <TutorialStep number={stepNumber} status={status} title={title} actions={unseen ? (<Tooltip content={translate(I18N_KEYS.INSTALL.BUTTON_INFOBOX)} placement="top" sx={{ width: '160px' }}>
              <Button type="button" sx={!canDownloadApp ? disableButton : undefined} onClick={!canDownloadApp ? undefined : onClickGetTheAppButton}>
                {translate(I18N_KEYS.INSTALL.BUTTON)}
                <div sx={{ marginLeft: '8px' }}>
                  <OpenWebsiteIcon color={colors.white}/>
                </div>
              </Button>
            </Tooltip>) : null}>
        {unseen ? (<Paragraph size="small">
            {translate(I18N_KEYS.INSTALL.TEXT)}
          </Paragraph>) : (<Paragraph size="small">
            {translate.markup(I18N_KEYS.ACCESS.TEXT, {
                hotspotShield: DOWNLOAD_URL,
            }, {
                linkTarget: OPEN_IN_NEW_TAB,
                onLinkClicked: logUserDownloadVpnClient,
            })}
          </Paragraph>)}
      </TutorialStep>
    </TutorialStepWrapper>);
};
