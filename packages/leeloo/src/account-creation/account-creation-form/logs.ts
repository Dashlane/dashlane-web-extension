import {
  CallToAction,
  InvitationLinkClickOrigin,
  SignupFlowStep,
  UserCallToActionEvent,
  UserSignupToDashlaneEvent,
} from "@dashlane/hermes";
import { logEvent } from "../../libs/logs/logEvent";
export const logUserSignupToDashlaneEvent = (
  signupFlowStep: SignupFlowStep,
  prefilledTeamKey: string,
  isFromMassDeployment: boolean
) => {
  logEvent(
    new UserSignupToDashlaneEvent({
      invitationLinkClickOrigin: isFromMassDeployment
        ? InvitationLinkClickOrigin.ExtensionMassDeployment
        : prefilledTeamKey
        ? InvitationLinkClickOrigin.SharedInvitationLink
        : InvitationLinkClickOrigin.InvitationEmail,
      signupFlowStep,
    })
  );
};
export const logAdminInstallExtensionClick = () => {
  logEvent(
    new UserCallToActionEvent({
      callToActionList: [CallToAction.Skip, CallToAction.InstallExtension],
      chosenAction: CallToAction.InstallExtension,
      hasChosenNoAction: false,
    })
  );
};
export const logAdminSkipClick = () => {
  logEvent(
    new UserCallToActionEvent({
      callToActionList: [CallToAction.Skip, CallToAction.InstallExtension],
      chosenAction: CallToAction.Skip,
      hasChosenNoAction: false,
    })
  );
};
export const logNavigateAway = () => {
  logEvent(
    new UserCallToActionEvent({
      callToActionList: [CallToAction.Skip, CallToAction.InstallExtension],
      hasChosenNoAction: true,
    })
  );
};
