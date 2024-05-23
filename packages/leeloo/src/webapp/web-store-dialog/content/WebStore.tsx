import { useEffect } from 'react';
import { Button, Heading, Icon, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import { DataStatus, useFeatureFlips } from '@dashlane/framework-react';
import { FEATURE_FLIPS_WITHOUT_MODULE } from '@dashlane/framework-dashlane-application';
import { getAdminRights } from 'libs/console';
import { usePremiumStatus } from 'libs/carbon/hooks/usePremiumStatus';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
import { logChromeStoreDismissAction, logChromeStoreOpen, logG2RatingWebsiteDismissAction, logG2RatingWebsiteOpen, logRateUsChromeStorePageView, } from '../logs';
import { CardLayout } from '../layout/CardLayout';
import ChromeWebStore from '../assets/chrome-web-store-icon.png';
import G2RateBanner from '../assets/g2-review_banner.png';
const CHROME_STORE_V2_FF = FEATURE_FLIPS_WITHOUT_MODULE.EcommerceWebChromeratingV2;
const CHROME_WEB_STORE_LINK = '*****';
const G2_RATING_LINK = '*****';
const I18N_KEYS = {
    TITLE: 'webapp_web_store_dialog_web_store_title',
    CHROME: {
        SUBTITLE: 'webapp_web_store_dialog_web_store_subtitle',
        WEB_STORE_NAME: 'webapp_web_store_dialog_web_store_store_name',
        TEXT: 'webapp_web_store_dialog_web_store_text',
        CTA: 'webapp_web_store_dialog_web_store_cta',
    },
    G2: {
        TEXT: 'webapp_web_store_dialog_g2_subtitle',
        CTA: 'webapp_web_store_dialog_g2_cta',
    },
};
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    MAIN: {
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        gap: '24px',
    },
    BANNER: {
        backgroundColor: 'ds.container.expressive.brand.quiet.idle',
        borderRadius: '4px',
        display: 'flex',
        padding: '16px',
        gap: '12px',
        alignItems: 'center',
    },
    BANNER_HEADER: {
        display: 'flex',
        flexDirection: 'column',
    },
};
interface WebStoreProps {
    onClose: () => void;
}
export const WebStore = ({ onClose }: WebStoreProps) => {
    const { translate } = useTranslate();
    const premiumStatus = usePremiumStatus();
    const retrievedFeatureFlips = useFeatureFlips();
    const isChromeStoreRatingV2FFEnabled = retrievedFeatureFlips.status === DataStatus.Success &&
        retrievedFeatureFlips.data[CHROME_STORE_V2_FF];
    const isAdmin = premiumStatus.status === DataStatus.Success &&
        premiumStatus.data &&
        getAdminRights(premiumStatus.data) === 'full';
    const g2CheckComplete = retrievedFeatureFlips.status === DataStatus.Success &&
        premiumStatus.status === DataStatus.Success;
    const shouldShowG2 = isChromeStoreRatingV2FFEnabled && isAdmin;
    const handleOpenCTALink = () => {
        if (shouldShowG2) {
            logG2RatingWebsiteOpen();
            openUrl(G2_RATING_LINK);
        }
        else {
            logChromeStoreOpen();
            openUrl(CHROME_WEB_STORE_LINK);
        }
        onClose();
    };
    const handleDismissDialog = () => {
        if (shouldShowG2) {
            logG2RatingWebsiteDismissAction();
        }
        else {
            logChromeStoreDismissAction();
        }
        onClose();
    };
    useEffect(() => {
        logRateUsChromeStorePageView();
    }, []);
    return g2CheckComplete ? (<CardLayout title={translate(I18N_KEYS.TITLE)} displayHeaderLogo onClose={handleDismissDialog}>
      <div sx={SX_STYLES.MAIN}>
        {shouldShowG2 ? (<img src={G2RateBanner} alt={'G2 review'} width="330px" height="70px"/>) : (<div sx={SX_STYLES.BANNER}>
            <img src={ChromeWebStore} alt={'chrome store'} width="40px" height="35px"/>
            <div sx={SX_STYLES.BANNER_HEADER}>
              <Paragraph sx={{ textTransform: 'uppercase' }}>
                {translate(I18N_KEYS.CHROME.SUBTITLE)}
              </Paragraph>
              <Heading as="h4">
                {translate(I18N_KEYS.CHROME.WEB_STORE_NAME)}
              </Heading>
            </div>
          </div>)}
        <Paragraph color="ds.text.neutral.catchy">
          {translate(shouldShowG2 ? I18N_KEYS.G2.TEXT : I18N_KEYS.CHROME.TEXT)}
        </Paragraph>
        <Button sx={{ width: '100%' }} type="button" onClick={handleOpenCTALink} role="link">
          {translate(shouldShowG2 ? I18N_KEYS.G2.CTA : I18N_KEYS.CHROME.CTA)}
          <div sx={{ paddingLeft: '6px' }}>
            <Icon name="ActionOpenExternalLinkOutlined" color="ds.text.inverse.catchy"/>
          </div>
        </Button>
      </div>
    </CardLayout>) : null;
};
