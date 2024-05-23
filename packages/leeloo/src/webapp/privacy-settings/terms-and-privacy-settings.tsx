import { Fragment } from 'react';
import { Button, Checkbox, jsx, Paragraph } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { MAIL_TO_SUPPORT_GDPR_WITHDRAW_CONSENT, PRIVACY_URL, TERMS_URL, } from 'app/routes/constants';
const I18N_KEYS = {
    DESCRIPTION: 'webapp_privacy_settings_permissions_description',
    CHECKBOX: 'webapp_privacy_settings_terms_and_privacy_checkbox_label_markup',
    REQUEST_CTA_LABEL: 'webapp_privacy_settings_request_cta_label',
};
export const TermsAndPrivacySettings = () => {
    const { translate } = useTranslate();
    return (<>
      <Paragraph>{translate(I18N_KEYS.DESCRIPTION)}</Paragraph>
      <Checkbox checked disabled={true} label={<Paragraph color="ds.text.neutral.catchy" sx={{ fontStyle: 'italic' }}>
            {translate.markup(I18N_KEYS.CHECKBOX, {
                termsLink: TERMS_URL,
                privacyLink: PRIVACY_URL,
            }, { linkTarget: '_blank' })}
          </Paragraph>} sx={{ margin: '16px 0', width: '100%' }}/>
      <Button intensity="quiet" role="link" onClick={() => {
            window.open(MAIL_TO_SUPPORT_GDPR_WITHDRAW_CONSENT);
        }}>
        {translate(I18N_KEYS.REQUEST_CTA_LABEL)}
      </Button>
      <hr sx={{
            borderTop: '1px solid ds.border.neutral.standard.idle',
            marginBottom: '0rem',
            marginTop: '2rem',
            width: '100%',
        }}/>
    </>);
};
