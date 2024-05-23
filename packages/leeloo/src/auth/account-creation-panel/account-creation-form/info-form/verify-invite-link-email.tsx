import { useCallback, useEffect, useState } from 'react';
import queryString from 'query-string';
import { Button, jsx } from '@dashlane/design-system';
import { InvitationLinkClickOrigin, PageView, SignupFlowStep, UserSignupToDashlaneEvent, } from '@dashlane/hermes';
import { FlexContainer, Heading, Paragraph } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { useInviteLinkData } from 'team/settings/hooks/useInviteLinkData';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { useLocation } from 'libs/router';
const I18N_KEYS = {
    RE_SEND_EMAIL_BUTTON: 'webapp_auth_panel_standalone_account_creation_invite_link_resend_button',
    HEADER: 'webapp_invite_link_header',
    EMAIL_SENT: 'webapp_invite_link_email_sent_description_markup',
    EMAIL_NOT_RECEIVED: 'webapp_invite_link_email_not_received_description',
};
export interface VerifyInviteLinkEmailProps {
    teamUuid: string;
    login: string;
}
export const VerifyInviteLinkEmail = ({ teamUuid, login, }: VerifyInviteLinkEmailProps) => {
    const { search } = useLocation();
    const queryParams = queryString.parse(search);
    const prefilledTeamKey = `${queryParams.team ?? ''}`;
    const [isLoading, setIsLoading] = useState(false);
    const { translate } = useTranslate();
    const { requestInviteLinkToken } = useInviteLinkData();
    const handleVerificationButtonClick = useCallback(async () => {
        setIsLoading(true);
        await requestInviteLinkToken(teamUuid, login);
        setIsLoading(false);
    }, [login, requestInviteLinkToken, teamUuid]);
    useEffect(() => {
        handleVerificationButtonClick();
    }, [handleVerificationButtonClick]);
    useEffect(() => {
        logPageView(PageView.JoinDashlaneTeamVerifyEmailAddress);
        logEvent(new UserSignupToDashlaneEvent({
            invitationLinkClickOrigin: prefilledTeamKey
                ? InvitationLinkClickOrigin.SharedInvitationLink
                : InvitationLinkClickOrigin.InvitationEmail,
            signupFlowStep: SignupFlowStep.VerifyEmail,
        }));
    }, [prefilledTeamKey]);
    return (<FlexContainer gap={6} flexDirection="column">
      <Heading>{translate(I18N_KEYS.HEADER)}</Heading>
      <Paragraph>
        {translate.markup(I18N_KEYS.EMAIL_SENT, {
            login: login,
        })}
      </Paragraph>
      <Paragraph>{translate(I18N_KEYS.EMAIL_NOT_RECEIVED)}</Paragraph>
      <Button sx={{ alignSelf: 'end' }} onClick={handleVerificationButtonClick} size="large" mood="neutral" intensity="quiet" disabled={isLoading} data-testid="resend-invite">
        {translate(I18N_KEYS.RE_SEND_EMAIL_BUTTON)}
      </Button>
    </FlexContainer>);
};
