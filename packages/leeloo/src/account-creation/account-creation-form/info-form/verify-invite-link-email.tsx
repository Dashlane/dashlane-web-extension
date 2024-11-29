import { useEffect, useState } from "react";
import { Button, Flex } from "@dashlane/design-system";
import { PageView, SignupFlowStep } from "@dashlane/hermes";
import { Heading, Paragraph } from "@dashlane/ui-components";
import { DataStatus } from "@dashlane/framework-react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logPageView } from "../../../libs/logs/logEvent";
import { useLocation } from "../../../libs/router";
import { logUserSignupToDashlaneEvent } from "../logs";
import { getSignUpUrlQueryParameters } from "../../helpers";
import { useTeamSignupInviteLink } from "../../hooks/use-team-signup-invite-link";
const I18N_KEYS = {
  RE_SEND_EMAIL_BUTTON:
    "webapp_auth_panel_standalone_account_creation_invite_link_resend_button",
  HEADER: "webapp_invite_link_header",
  EMAIL_SENT: "webapp_invite_link_email_sent_description_markup",
  EMAIL_NOT_RECEIVED: "webapp_invite_link_email_not_received_description",
};
export interface VerifyInviteLinkEmailProps {
  login: string;
}
export const VerifyInviteLinkEmail = ({
  login,
}: VerifyInviteLinkEmailProps) => {
  const { search } = useLocation();
  const { prefilledTeamKey, isFromMassDeployment } =
    getSignUpUrlQueryParameters(search);
  const [isLoading, setIsLoading] = useState(false);
  const { translate } = useTranslate();
  const teamInviteLinkData = useTeamSignupInviteLink(prefilledTeamKey);
  const handleVerificationButtonClick = async () => {
    if (teamInviteLinkData.status === DataStatus.Success) {
      setIsLoading(true);
      await teamInviteLinkData.sendRequestUserInviteToken(login);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleVerificationButtonClick();
  }, [teamInviteLinkData.status, login]);
  useEffect(() => {
    logPageView(PageView.JoinDashlaneTeamVerifyEmailAddress);
    logUserSignupToDashlaneEvent(
      SignupFlowStep.VerifyEmail,
      prefilledTeamKey,
      isFromMassDeployment
    );
  }, [isFromMassDeployment, prefilledTeamKey]);
  return (
    <Flex gap={6} flexDirection="column">
      <Heading>{translate(I18N_KEYS.HEADER)}</Heading>
      <Paragraph>
        {translate.markup(I18N_KEYS.EMAIL_SENT, {
          login: login,
        })}
      </Paragraph>
      <Paragraph>{translate(I18N_KEYS.EMAIL_NOT_RECEIVED)}</Paragraph>
      <Button
        sx={{ alignSelf: "end" }}
        onClick={handleVerificationButtonClick}
        size="large"
        mood="neutral"
        intensity="quiet"
        disabled={isLoading}
        data-testid="resend-invite"
      >
        {translate(I18N_KEYS.RE_SEND_EMAIL_BUTTON)}
      </Button>
    </Flex>
  );
};
