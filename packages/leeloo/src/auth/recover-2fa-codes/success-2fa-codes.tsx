import React from 'react';
import { Heading, Infobox, jsx, Paragraph } from '@dashlane/design-system';
import { FlexContainer, Link } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    TITLE: 'webapp_recover_otp_codes_success_header_title',
    WARNING: {
        TITLE: 'webapp_recover_otp_codes_success_two_codes_warning_title',
        CONTENT: 'webapp_recover_otp_codes_success_two_codes_warning',
        LEARN_MORE: 'webapp_recover_otp_codes_success_two_codes_warning_learn_more',
    },
    INSTRUCTIONS: {
        TITLE: 'webapp_recover_otp_disable_2fa_instructions_title',
        COMPLETE_LOGIN: 'webapp_recover_otp_disable_2fa_instructions_complete_login',
        OPEN_WEB_APP: 'webapp_recover_otp_disable_2fa_instructions_open_web_app_markup',
        OPEN_SECURITY_SETTINGS: 'webapp_recover_otp_disable_2fa_instructions_open_security_settings_markup',
        TOGGLE_OFF: 'webapp_recover_otp_disable_2fa_instructions_toggle_off_markup',
        ENTER_SECOND_CODE: 'webapp_recover_otp_disable_2fa_instructions_enter_second_code',
        NOW_DISABLED: 'webapp_recover_otp_disable_2fa_instructions_now_disabled',
    },
};
export const RecoverOtpCodesSuccessComponent = () => {
    const { translate } = useTranslate();
    return (<div>
      <FlexContainer flexDirection={'column'} gap={'16px'}>
        <Heading as="h1" textStyle="ds.title.section.medium">
          {translate(I18N_KEYS.TITLE)}
        </Heading>
        <Infobox title={translate(I18N_KEYS.WARNING.TITLE)} mood="warning" description={<FlexContainer flexDirection={'column'}>
              <Paragraph>{translate(I18N_KEYS.WARNING.CONTENT)}</Paragraph>
              <Link href="*****" sx={{ color: 'ds.text.brand.standard' }}>
                {translate(I18N_KEYS.WARNING.LEARN_MORE)}
              </Link>
            </FlexContainer>}/>
        <Heading as="h2">{translate(I18N_KEYS.INSTRUCTIONS.TITLE)}</Heading>

        <Paragraph as="ul" sx={{
            listStyleType: 'disc',
            listStylePosition: 'outside',
            marginLeft: '24px',
        }}>
          <li>{translate(I18N_KEYS.INSTRUCTIONS.COMPLETE_LOGIN)}</li>
          <li>{translate.markup(I18N_KEYS.INSTRUCTIONS.OPEN_WEB_APP)}</li>
          <li>
            {translate.markup(I18N_KEYS.INSTRUCTIONS.OPEN_SECURITY_SETTINGS)}
          </li>
          <li>{translate.markup(I18N_KEYS.INSTRUCTIONS.TOGGLE_OFF)}</li>
          <li>{translate(I18N_KEYS.INSTRUCTIONS.ENTER_SECOND_CODE)}</li>
          <li>{translate(I18N_KEYS.INSTRUCTIONS.NOW_DISABLED)}</li>
        </Paragraph>
      </FlexContainer>
    </div>);
};
