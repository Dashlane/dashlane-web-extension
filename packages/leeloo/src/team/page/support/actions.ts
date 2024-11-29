import { CallToAction, UserCallToActionEvent } from "@dashlane/hermes";
import { NamedRoutes } from "../../../app/routes/types";
import { openUrl } from "../../../libs/external-urls";
import { logEvent } from "../../../libs/logs/logEvent";
import { redirect } from "../../../libs/router";
import {
  BUSINESS_BUY,
  CONTACT_SUPPORT_WITH_TRACKING,
  DASHLANE_ENTERPRISE_CONTACT_FORM,
  DASHLANE_REGISTER_FOR_WEBINAR,
  REQUEST_PHONE_CALL,
} from "../../urls";
export enum SupportOption {
  SECURITY_GUIDANCE = "security_guidance",
  TRAINING = "training",
  SEND_MESSAGE = "send_message",
}
const contactOptionToSupportURLMap = {
  [SupportOption.SECURITY_GUIDANCE]: DASHLANE_ENTERPRISE_CONTACT_FORM,
  [SupportOption.TRAINING]: DASHLANE_REGISTER_FOR_WEBINAR,
  [SupportOption.SEND_MESSAGE]: CONTACT_SUPPORT_WITH_TRACKING,
};
const contactOptionToCallToActionMap = {
  [SupportOption.SECURITY_GUIDANCE]: CallToAction.RequestDemo,
  [SupportOption.TRAINING]: CallToAction.RegisterWebinar,
  [SupportOption.SEND_MESSAGE]: CallToAction.SendEmail,
};
const CONTACT_SUPPORT_UTM_CODE =
  "button:upgrade_business_tier+origin_page:tac/modal_contact_support+origin_component:main_app";
export const handleClickPhoneSupportAction = (
  hasPhoneSupportCapability: boolean,
  routes: NamedRoutes,
  isFreeTrial?: boolean,
  isGracePeriod?: boolean,
  subscriptionCode?: string
) => {
  const callToActionList: CallToAction[] = [
    CallToAction.SendEmail,
    CallToAction.RequestDemo,
    CallToAction.RegisterWebinar,
    CallToAction.Dismiss,
  ];
  if (hasPhoneSupportCapability) {
    callToActionList.push(CallToAction.ContactPhoneSupport);
    logEvent(
      new UserCallToActionEvent({
        callToActionList,
        chosenAction: CallToAction.ContactPhoneSupport,
        hasChosenNoAction: false,
      })
    );
    openUrl(REQUEST_PHONE_CALL);
    return;
  }
  if (!hasPhoneSupportCapability && (isFreeTrial || isGracePeriod)) {
    callToActionList.push(CallToAction.RequestUpgrade);
    logEvent(
      new UserCallToActionEvent({
        callToActionList,
        chosenAction: CallToAction.RequestUpgrade,
        hasChosenNoAction: false,
      })
    );
    openUrl(
      `${BUSINESS_BUY}?plan=business&subCode=${
        subscriptionCode ?? ""
      }&utm_source=${CONTACT_SUPPORT_UTM_CODE}`
    );
    return;
  }
  callToActionList.push(CallToAction.RequestUpgrade);
  logEvent(
    new UserCallToActionEvent({
      callToActionList,
      chosenAction: CallToAction.RequestUpgrade,
      hasChosenNoAction: false,
    })
  );
  return redirect(`${routes.teamAccountChangePlanRoutePath}?plan=business`);
};
export const handleClickSupportOption = (
  contactOption: SupportOption,
  hasPhoneSupportCapability: boolean
) => {
  const callToActionList: CallToAction[] = [
    CallToAction.SendEmail,
    CallToAction.RequestDemo,
    CallToAction.RegisterWebinar,
    CallToAction.Dismiss,
  ];
  callToActionList.push(
    hasPhoneSupportCapability
      ? CallToAction.ContactPhoneSupport
      : CallToAction.RequestUpgrade
  );
  logEvent(
    new UserCallToActionEvent({
      callToActionList,
      chosenAction: contactOptionToCallToActionMap[contactOption],
      hasChosenNoAction: false,
    })
  );
  openUrl(contactOptionToSupportURLMap[contactOption]);
};
export const handleDismissDialog = (
  onDismiss: () => void,
  hasPhoneSupportCapability: boolean | null
) => {
  const callToActionList: CallToAction[] = [
    CallToAction.SendEmail,
    CallToAction.RequestDemo,
    CallToAction.RegisterWebinar,
    CallToAction.Dismiss,
  ];
  callToActionList.push(
    hasPhoneSupportCapability
      ? CallToAction.ContactPhoneSupport
      : CallToAction.RequestUpgrade
  );
  logEvent(
    new UserCallToActionEvent({
      callToActionList,
      hasChosenNoAction: true,
    })
  );
  onDismiss();
};
