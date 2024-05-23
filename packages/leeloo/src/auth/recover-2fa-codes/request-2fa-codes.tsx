import { useState } from 'react';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import { Button, EmailField, Heading, IndeterminateLoader, Infobox, jsx, Paragraph, useToast, } from '@dashlane/design-system';
import { FlexContainer, Link } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { Recover2FAErrors, useRecover2faCodes } from './use-recover-2fa-code';
const I18N_KEYS = {
    HEADER: {
        TITLE: 'webapp_recover_otp_codes_header_title',
        SUBTITLE: 'webapp_recover_otp_codes_header_subtitle',
    },
    BUSINESS_INFOBOX_HELP: {
        TITLE: 'webapp_recover_otp_codes_business_infobox_help_title',
        DESCRIPTION: 'webapp_recover_otp_codes_business_infobox_help_description',
    },
    STEPS: {
        TITLE: 'webapp_recover_otp_codes_steps_title',
        ENTER_EMAIL: 'webapp_recover_otp_codes_steps_enter_email',
        GET_SMS: 'webapp_recover_otp_codes_steps_get_sms',
        LOGIN_WITH_RECOVERY_CODE: 'webapp_recover_otp_codes_steps_login_with_recovery_code',
        COMPLETE_2FA_SETUP: 'webapp_recover_otp_codes_steps_complete_2fa_setup',
    },
    FORM: {
        EMAIL_LABEL: 'webapp_recover_otp_codes_form_email_label',
        GET_RECOVERY_CODE_CTA: 'webapp_recover_otp_codes_form_get_recovery_code_cta',
    },
    MORE_INFO: {
        TITLE: 'webapp_recover_otp_codes_more_info_title',
        LINK: 'webapp_recover_otp_codes_more_info_link',
    },
    DEFAULT_TOAST_ACTION: '_common_toast_close_label',
    ERROR: '_common_generic_error',
};
const I18N_KEYS_ERRORS: Record<Recover2FAErrors, string> = {
    NetworkError: '_common_alert_network_error_message',
    UnknownError: '_common_generic_error',
    AccountNotEligible: 'webapp_recover_otp_codes_account_not_eligible',
};
const HELP_CENTER_LINK = '*****';
export interface Recover2faCodesRequestComponentProps {
    onSuccess: () => void;
}
enum State {
    Idle,
    Sending,
    Error
}
export const Recover2faCodesRequestComponent = ({ onSuccess, }: Recover2faCodesRequestComponentProps) => {
    const { search } = useLocation();
    const queryParams = queryString.parse(search);
    const { translate } = useTranslate();
    const [email, setEmail] = useState(queryParams.account ?? '');
    const [state, setState] = useState(State.Idle);
    const { showToast } = useToast();
    const [emailErrorLabel, setEmailErrorLabel] = useState<Recover2FAErrors | null>(null);
    const { recoverOtpCodes } = useRecover2faCodes({
        onSuccess,
        onError: (e) => {
            if (e === 'NetworkError' || e === 'UnknownError') {
                showToast({
                    mood: 'danger',
                    description: translate(I18N_KEYS_ERRORS[e]),
                });
                setEmailErrorLabel(null);
            }
            else {
                setEmailErrorLabel(e);
            }
            setState(State.Error);
        },
    });
    const submit = () => {
        setEmailErrorLabel(null);
        setState(State.Sending);
        recoverOtpCodes(email);
    };
    const canSend = state === State.Idle || state === State.Error;
    return (<div>
      <FlexContainer flexDirection={'column'} gap={'16px'}>
        <Heading as="h1" textStyle="ds.title.section.medium">
          {translate(I18N_KEYS.HEADER.SUBTITLE)}
        </Heading>
        <Infobox mood="brand" title={translate(I18N_KEYS.BUSINESS_INFOBOX_HELP.TITLE)} description={translate(I18N_KEYS.BUSINESS_INFOBOX_HELP.DESCRIPTION)}/>
        <Paragraph>{translate(I18N_KEYS.STEPS.TITLE)}</Paragraph>
        <Paragraph as="ul" sx={{
            listStyleType: 'disc',
            listStylePosition: 'outside',
            marginLeft: '24px',
        }}>
          <li>{translate(I18N_KEYS.STEPS.ENTER_EMAIL)}</li>
          <li>{translate(I18N_KEYS.STEPS.GET_SMS)}</li>
          <li>{translate(I18N_KEYS.STEPS.LOGIN_WITH_RECOVERY_CODE)}</li>
          <li>{translate(I18N_KEYS.STEPS.COMPLETE_2FA_SETUP)}</li>
        </Paragraph>
        <form onSubmit={(e) => {
            submit();
            e.preventDefault();
        }}>
          <FlexContainer gap={'16px'} sx={{
            margin: '24px 8px 8px 8px',
            padding: '40px',
            alignItems: 'flex-start',
            alignContent: 'flex-start',
            bg: 'ds.container.agnostic.neutral.quiet',
            borderRadius: '8px',
            alignSelf: 'stretch',
            flexWrap: 'wrap',
            justify: 'stretch',
            justifyContent: 'flex-end',
        }}>
            <div sx={{
            flex: 1,
            minWidth: '280px',
        }}>
              <EmailField label={translate(I18N_KEYS.FORM.EMAIL_LABEL)} value={email} onChange={(e) => setEmail(e.target.value)} disabled={!canSend} error={!!emailErrorLabel} feedback={emailErrorLabel
            ? translate(I18N_KEYS_ERRORS[emailErrorLabel])
            : undefined}/>
            </div>

            <Button size="large" type="submit" disabled={!canSend || email.length === 0} sx={{ marginTop: '4px' }}>
              {state === State.Sending ? (<IndeterminateLoader mood="brand"/>) : (translate(I18N_KEYS.FORM.GET_RECOVERY_CODE_CTA))}
            </Button>
          </FlexContainer>
        </form>
        <Paragraph>{translate(I18N_KEYS.MORE_INFO.TITLE)}</Paragraph>
        <Link href={HELP_CENTER_LINK} sx={{ color: 'ds.text.brand.standard' }}>
          {translate(I18N_KEYS.MORE_INFO.LINK)}
        </Link>
      </FlexContainer>
    </div>);
};
