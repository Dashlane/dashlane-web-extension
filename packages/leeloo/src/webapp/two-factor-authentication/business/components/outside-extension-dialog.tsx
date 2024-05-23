import { Fragment } from 'react';
import { colors, CrossCircleIcon, DialogBody, DialogFooter, DialogTitle, jsx, OpenWebsiteIcon, Paragraph, } from '@dashlane/ui-components';
import { DASHLANE_DOWNLOAD_EXTENSION_URL } from 'webapp/urls';
import { getCurrentBrowserName, isSupportedBrowser, isSupportedMobile, } from 'webapp/two-factor-authentication/business/helpers/browser';
import useTranslate from 'libs/i18n/useTranslate';
import { openUrl } from 'libs/external-urls';
const I18N_KEYS = {
    BROWSER_NOT_SUPPORTED_DESCRIPTION: 'webapp_two_factor_authentication_enforcement_dialog_unsupported_browser_desc_markup',
    BROWSER_NOT_SUPPORTED_TITLE: 'webapp_two_factor_authentication_enforcement_dialog_unsupported_browser_title',
    BROWSER_SUPPORTED_DESCRIPTION: 'webapp_two_factor_authentication_enforcement_dialog_supported_browser_desc',
    BROWSER_SUPPORTED_TITLE: 'webapp_two_factor_authentication_enforcement_dialog_supported_browser_title',
    MOBILE_SUPPORTED_DESCRIPTION: 'webapp_two_factor_authentication_enforcement_dialog_supported_mobile_desc',
    MOBILE_SUPPORTED_TITLE: 'webapp_two_factor_authentication_enforcement_dialog_supported_mobile_title',
    COMPANY_REQUIREMENT: 'webapp_two_factor_authentication_enforcement_dialog_description_1',
    DOWNLOAD_DASHLANE: 'webapp_two_factor_authentication_enforcement_dialog_supported_browser_action',
    LOGOUT: 'webapp_logout_dialog_confirm',
};
interface Props {
    onSecondaryButtonAction: () => void;
}
const SupportedMobileBrowser = ({ onSecondaryButtonAction }: Props) => {
    const { translate } = useTranslate();
    return (<>
      <DialogTitle id="dialogTitle" title={translate(I18N_KEYS.MOBILE_SUPPORTED_TITLE)}/>
      <DialogBody>
        <Paragraph color={colors.grey00}>
          {translate(I18N_KEYS.COMPANY_REQUIREMENT)}
        </Paragraph>
        <Paragraph color={colors.grey00}>
          {translate(I18N_KEYS.MOBILE_SUPPORTED_DESCRIPTION)}
        </Paragraph>
      </DialogBody>
      <DialogFooter secondaryButtonTitle={translate(I18N_KEYS.LOGOUT)} secondaryButtonOnClick={onSecondaryButtonAction}/>
    </>);
};
const UnsupportedBrowser = ({ onSecondaryButtonAction }: Props) => {
    const { translate } = useTranslate();
    return (<>
      <CrossCircleIcon size={96}/>
      <DialogTitle id="dialogTitle" title={translate(I18N_KEYS.BROWSER_NOT_SUPPORTED_TITLE)}/>
      <DialogBody>
        <Paragraph color={colors.grey00}>
          {translate(I18N_KEYS.COMPANY_REQUIREMENT)}
        </Paragraph>
        <Paragraph color={colors.grey00}>
          {translate.markup(I18N_KEYS.BROWSER_NOT_SUPPORTED_DESCRIPTION, undefined, {
            linkTarget: '_blank',
        }, { sx: {} })}
        </Paragraph>
      </DialogBody>
      <DialogFooter secondaryButtonTitle={translate(I18N_KEYS.LOGOUT)} secondaryButtonOnClick={onSecondaryButtonAction}/>
    </>);
};
const SupportedBrowser = ({ onSecondaryButtonAction }: Props) => {
    const { translate } = useTranslate();
    const handleOnPrimaryAction = () => {
        openUrl(DASHLANE_DOWNLOAD_EXTENSION_URL);
    };
    return (<>
      <DialogTitle id="dialogTitle" title={translate(I18N_KEYS.BROWSER_SUPPORTED_TITLE)}/>
      <DialogBody>
        
        <div sx={{ overflow: 'hidden' }}>
          <Paragraph color={colors.grey00}>
            {translate(I18N_KEYS.COMPANY_REQUIREMENT)}
          </Paragraph>
          <Paragraph color={colors.grey00}>
            {translate(I18N_KEYS.BROWSER_SUPPORTED_DESCRIPTION, {
            browser: getCurrentBrowserName(),
        })}
          </Paragraph>
        </div>
      </DialogBody>
      <DialogFooter primaryButtonTitle={<>
            {translate(I18N_KEYS.DOWNLOAD_DASHLANE, {
                browser: getCurrentBrowserName(),
            })}
            <span sx={{ marginLeft: '8px' }}>
              <OpenWebsiteIcon color={colors.white}/>
            </span>
          </>} primaryButtonOnClick={handleOnPrimaryAction} secondaryButtonTitle={translate(I18N_KEYS.LOGOUT)} secondaryButtonOnClick={onSecondaryButtonAction}/>
    </>);
};
export const OutsideExtensionDialog = (props: Props) => {
    if (isSupportedMobile()) {
        return <SupportedMobileBrowser {...props}/>;
    }
    return isSupportedBrowser() ? (<SupportedBrowser {...props}/>) : (<UnsupportedBrowser {...props}/>);
};
