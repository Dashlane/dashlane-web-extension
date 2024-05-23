import { Button, colors, FlexContainer, Heading, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
import zIndexVars from 'libs/dashlane-style/globals/z-index-variables.css';
import downloadExtensionImage from '../assets/download_extension.png';
import { DASHLANE_DOWNLOAD_EXTENSION_URL } from 'webapp/urls';
const I18N_KEYS = {
    TITLE: 'webapp_vpn_download_extension_title',
    TEXT: 'webapp_vpn_download_extension_text',
    DOWNLOAD_BUTTON: 'webapp_vpn_download_extension_button',
};
const containerStyles: ThemeUIStyleObject = {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    position: 'absolute',
    top: '0px',
    zIndex: zIndexVars['--z-index-webapp-feature-onboarding-overlay'],
    overflow: 'auto',
};
export const VpnExtensionOnboarding = () => {
    const { translate } = useTranslate();
    return (<FlexContainer flexDirection="column" alignItems="center" sx={containerStyles}>
      <img sx={{ mt: '64px', maxWidth: '480px' }} src={downloadExtensionImage}/>
      <Heading sx={{ mt: '40px', maxWidth: '480px' }} size="medium">
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <Paragraph sx={{ mt: '18px', maxWidth: '480px' }} size="medium">
        {translate(I18N_KEYS.TEXT)}
      </Paragraph>
      <Button sx={{ mt: '40px' }} type="button" onClick={() => openUrl(DASHLANE_DOWNLOAD_EXTENSION_URL)}>
        {translate(I18N_KEYS.DOWNLOAD_BUTTON)}
      </Button>
    </FlexContainer>);
};
