import { useEffect, useRef, useState } from "react";
import {
  InvitationLinkClickOrigin,
  PageView,
  SignupFlowStep,
  UserSignupToDashlaneEvent,
} from "@dashlane/hermes";
import { DataStatus } from "@dashlane/framework-react";
import { Lee } from "../../../lee";
import { carbonConnector } from "../../../libs/carbon/connector";
import {
  augmentUrlWithProperSsoQueryParameters,
  redirectToUrl,
} from "../../../libs/external-urls";
import { useLocation } from "../../../libs/router";
import { VerifyInviteLinkEmail } from "./verify-invite-link-email";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import { EmailInputForm } from "./email-input-form";
import { getSignUpUrlQueryParameters } from "../../helpers";
import { useTeamSignupInviteLink } from "../../hooks/use-team-signup-invite-link";
export enum LoginErrorTypes {
  SSO_USER_NON_PROVISIONED = "sso_user_non_provisioned",
  INVALID_EMAIL = "invalid_email",
  FAILED = "failed",
  USER_NOT_PROPOSED = "user_non_proposed",
  TEAM_ACCEPTANCE_NEEDED = "team_acceptance_needed",
  TEAM_ACCEPTANCE_FAILED = "team_acceptance_failed",
}
export interface InfoSubmitOptions {
  login: string | null;
  isProposedExpired: boolean | undefined;
  isUserProposed: boolean | undefined;
  isUserAccepted: boolean | undefined;
}
interface InfoFormProps {
  lee: Lee;
  onSubmit: (info: InfoSubmitOptions) => void;
  isB2BFlow: boolean;
  hasBeenRedirected: boolean;
  setHasBeenRedirected: (hasBeenRedirected: boolean) => void;
  isEmployeeSignUpFlow: boolean;
  loginValue: string;
  setLoginValue: (loginValue: string) => void;
  isAcceptTeamInviteCheckDone: boolean;
}
export const InfoForm = ({
  isEmployeeSignUpFlow,
  loginValue,
  setLoginValue,
  ...rest
}: InfoFormProps) => {
  const { search } = useLocation();
  const { prefilledTeamKey, isFromMassDeployment } =
    getSignUpUrlQueryParameters(search);
  const teamInviteLinkData = useTeamSignupInviteLink(prefilledTeamKey);
  const [teamAcceptanceNeeded, setTeamAcceptanceNeeded] = useState(false);
  const [loginErrorType, setLoginErrorType] = useState<LoginErrorTypes | null>(
    null
  );
  const emailField = useRef<HTMLInputElement>(null);
  const unsubscribeFns = useRef<Array<() => void>>([]);
  const isInviteLinkFlow = isEmployeeSignUpFlow && !!prefilledTeamKey;
  const isInviteLinkDisabled =
    isInviteLinkFlow &&
    teamInviteLinkData.status === DataStatus.Success &&
    teamInviteLinkData.disabled;
  useEffect(() => {
    emailField.current?.focus?.();
  }, []);
  useEffect(() => {
    if (isEmployeeSignUpFlow) {
      logPageView(PageView.JoinDashlaneTeamEnterEmailAddress);
      const invitationEmailOrSharedLink = isInviteLinkFlow
        ? InvitationLinkClickOrigin.SharedInvitationLink
        : InvitationLinkClickOrigin.InvitationEmail;
      const invitationLinkClickOrigin = isFromMassDeployment
        ? InvitationLinkClickOrigin.ExtensionMassDeployment
        : invitationEmailOrSharedLink;
      logEvent(
        new UserSignupToDashlaneEvent({
          invitationLinkClickOrigin,
          signupFlowStep: SignupFlowStep.EnterEmailAddress,
        })
      );
    }
  }, [isEmployeeSignUpFlow, isFromMassDeployment, isInviteLinkFlow]);
  useEffect(() => {
    unsubscribeFns.current = unsubscribeFns.current.concat([
      carbonConnector.liveServiceProviderUrl.on((url: string) => {
        redirectToUrl(augmentUrlWithProperSsoQueryParameters(url));
      }),
    ]);
    return () => {
      unsubscribeFns.current.forEach((unsubscribe) => unsubscribe());
      unsubscribeFns.current = [];
    };
  }, []);
  useEffect(() => {
    if (loginErrorType === LoginErrorTypes.TEAM_ACCEPTANCE_NEEDED) {
      setTeamAcceptanceNeeded(true);
    }
  }, [loginErrorType]);
  const emailVerificationNeeded =
    !isInviteLinkDisabled && teamAcceptanceNeeded && loginValue;
  return emailVerificationNeeded ? (
    <VerifyInviteLinkEmail login={loginValue} />
  ) : (
    <EmailInputForm
      {...rest}
      loginValue={loginValue}
      setLoginValue={setLoginValue}
      loginErrorType={loginErrorType}
      setLoginErrorType={setLoginErrorType}
      isEmployeeSignUpFlow={isEmployeeSignUpFlow}
    />
  );
};
