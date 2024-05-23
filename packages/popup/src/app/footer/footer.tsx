import * as React from 'react';
import { DashlaneLogoIcon, DropdownElement, DropdownMenu, HelpIcon, jsx, } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { Button } from '@dashlane/design-system';
import { HelpCenterArticleCta, UserOpenHelpCenterEvent, } from '@dashlane/hermes';
import { usePremiumStatusData } from 'src/libs/api';
import { isPremiumStatus } from 'src/libs/session/premiumStatus';
import useTranslate from 'src/libs/i18n/useTranslate';
import { NewNotification } from 'src/app/footer/whats-new/badge';
import { DASHLANE_SUPPORT_PAGE, openExternalUrl, WHATS_NEW_SUPPORT_URL, } from 'libs/externalUrls';
import { logEvent } from 'libs/logs/logEvent';
import { useIsBusinessAdmin } from 'libs/hooks/use-is-business-admin';
import { B2BDiscontinuationBanner } from 'app/footer/banner/b2b-discontinuation-banner';
import { getLastSeenWhatsNewVersion, getLocalWhatsNewVersion, storeLastSeenWhatsNewVersion, } from './whats-new/versionUtils';
import { AddNewButton, SyncButton } from './buttons';
import { openWebAppAndClosePopup } from '../helpers';
import styles from 'app/footer/styles.css';
const I18N_KEYS = {
    OPEN_THE_WEB_APP: 'footer_open_webapp',
    OPEN_WHATS_NEW: 'footer_whats_new',
    OPEN_HELPCENTER: 'footer_get_help',
    WHATS_NEW_OR_HELPCENTER_TOOLTIP: 'footer_dashlane_support',
};
const SX_STYLES = {
    FOOTER: {
        display: 'flex',
        backgroundColor: 'ds.container.agnostic.neutral.quiet',
        alignItems: 'center',
        padding: '8px',
    },
    WHATS_NEW_OR_HELPCENTER: {
        width: '100%',
    },
};
const isFirstVersionHigherThanSecond = (first: string, second: string): boolean => {
    return first > second;
};
const FooterComponent = () => {
    const { translate } = useTranslate();
    const premiumStatusData = usePremiumStatusData();
    const premiumStatus = premiumStatusData.status === DataStatus.Success
        ? premiumStatusData.data
        : undefined;
    const isPremiumUser = isPremiumStatus(premiumStatus?.statusCode);
    const isAdmin = useIsBusinessAdmin();
    const localWhatsNewVersion = getLocalWhatsNewVersion();
    const [lastSeenWhatsNewVersion, setLastSeenWhatsNewVersion] = React.useState(localWhatsNewVersion);
    React.useEffect(() => {
        getLastSeenWhatsNewVersion()
            .then(setLastSeenWhatsNewVersion)
            .catch(() => {
        });
    }, []);
    const shouldShowNewNotification = localWhatsNewVersion
        ? lastSeenWhatsNewVersion
            ? isFirstVersionHigherThanSecond(localWhatsNewVersion, lastSeenWhatsNewVersion)
            : true
        : false;
    const handleOpenWebApp = () => {
        void openWebAppAndClosePopup({ route: '/passwords' });
    };
    const handleOpenSupport = () => {
        void logEvent(new UserOpenHelpCenterEvent({
            helpCenterArticleCta: HelpCenterArticleCta.GetHelp,
        }));
        void openExternalUrl(DASHLANE_SUPPORT_PAGE);
    };
    const handleOpenWhatsNew = () => {
        setLastSeenWhatsNewVersion(localWhatsNewVersion);
        try {
            storeLastSeenWhatsNewVersion(localWhatsNewVersion);
        }
        catch {
        }
        void openExternalUrl(WHATS_NEW_SUPPORT_URL);
    };
    return (<div sx={{
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            bottom: '0',
            width: '100%',
        }}>
      {isAdmin ? <B2BDiscontinuationBanner /> : null}
      <div className={styles.container} sx={SX_STYLES.FOOTER}>
        <Button mood="neutral" intensity="quiet" onClick={handleOpenWebApp} role="link" layout="iconLeading" size="small" icon={<DashlaneLogoIcon size={16}/>}>
          {translate(I18N_KEYS.OPEN_THE_WEB_APP)}
        </Button>

        <div className={styles.icons}>
          <AddNewButton />
          <DropdownMenu placement="top" menuClassName="help-dropdown" sx={{ zIndex: 2 }} content={[
            <DropdownElement key="whats-new" elementClassName="whats-new" data-testid={'whats-new'} onClick={handleOpenWhatsNew} sx={SX_STYLES.WHATS_NEW_OR_HELPCENTER}>
                {translate(I18N_KEYS.OPEN_WHATS_NEW)}
                {shouldShowNewNotification && (<NewNotification parentShape="rectangle"/>)}
              </DropdownElement>,
            <DropdownElement key="help-center" elementClassName="help-center" data-testid={'help-center'} onClick={handleOpenSupport} sx={SX_STYLES.WHATS_NEW_OR_HELPCENTER}>
                {translate(I18N_KEYS.OPEN_HELPCENTER)}
              </DropdownElement>,
        ]}>
            <Button key="help" title={translate(I18N_KEYS.WHATS_NEW_OR_HELPCENTER_TOOLTIP)} aria-label={translate(I18N_KEYS.WHATS_NEW_OR_HELPCENTER_TOOLTIP)} role="link" layout="iconOnly" intensity="supershy" mood="neutral" icon={<div className={styles.help}>
                  <HelpIcon />
                  {shouldShowNewNotification && (<NewNotification parentShape="square"/>)}
                </div>}/>
          </DropdownMenu>
          {isPremiumUser && <SyncButton />}
        </div>
      </div>
    </div>);
};
export const Footer = React.memo(FooterComponent, () => true);
