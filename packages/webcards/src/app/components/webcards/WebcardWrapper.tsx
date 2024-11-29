import * as React from "react";
import {
  AutofillDropdownWebcardConfiguration,
  WebcardType,
} from "@dashlane/autofill-engine/types";
import { I18nContext } from "../../context/i18n";
import { WebcardPropsBase } from "./config";
import { AutofillConfirmation } from "./dialogs/AutofillConfirmation";
import { AutoLoginSelection } from "./dialogs/AutologinSelection";
import { DataCapture } from "./dialogs/DataCapture";
import { FeedbackNotification } from "./dialogs/FeedbackNotification";
import { FollowUpNotification } from "./dialogs/FollowUpNotification";
import { Onboarding } from "./dialogs/Onboarding";
import { PhishingPreventionPrompt } from "./dialogs/phishing-prevention.component";
import { SavePassword } from "./dialogs/SavePassword";
import { UserVerification } from "./dialogs/UserVerificationWebcard";
import { WarnGeneratedPassword } from "./dialogs/WarnGeneratedPassword";
import { WebauthnCreateConfirmation } from "./dialogs/WebauthnCreateConfirmation";
import { WebauthnGetConfirmation } from "./dialogs/WebauthnGetConfirmation";
import { WebauthnPasskeySelection } from "./dialogs/WebauthnPasskeySelection";
import { Autofill } from "./dropdowns/Autofill";
import { SelfCorrectingMenu } from "./dropdowns/common/SelfCorrectingMenu";
import { FieldDisabledNotification } from "./dropdowns/FieldDisabledNotification";
import { GeneratePassword } from "./dropdowns/GeneratePassword";
import { Reactivation } from "./dropdowns/Reactivation";
import { WebAuthnReactivation } from "./dropdowns/WebAuthnReactivation";
import { LinkedWebsiteUpdateConfirmation } from "./dialogs/linked-website-update-confirmation";
import { B2CFrozenDialog } from "./dialogs/B2CFrozenDialog";
import { B2CFrozenDropdown } from "./dropdowns/B2CFrozenDropdown";
export const translationNamespaceForWebcardType: Record<WebcardType, string> = {
  [WebcardType.AutofillConfirmationPasswordLess]: "autofill-confirmation",
  [WebcardType.AutofillDropdown]: "autofill-dropdown",
  [WebcardType.AutologinSelection]: "autologin-selection",
  [WebcardType.B2CFrozenDialog]: "b2c-frozen-dialog",
  [WebcardType.DataCapture]: "data-capture",
  [WebcardType.FeedbackNotification]: "feedback-notification",
  [WebcardType.FollowUpNotification]: "follow-up-notification",
  [WebcardType.LinkedWebsiteUpdateConfirmation]:
    "linked-website-update-confirmation",
  [WebcardType.OnboardingNotification]: "notification",
  [WebcardType.PhishingPrevention]: "phishing-prevention",
  [WebcardType.SavePassword]: "save-password",
  [WebcardType.UserVerification]: "user-verification",
  [WebcardType.WarnGeneratedPassword]: "warn-generated-password",
  [WebcardType.WebauthnCreateConfirmation]: "webauthn-create-confirmation",
  [WebcardType.WebauthnGetConfirmation]: "webauthn-get-confirmation",
  [WebcardType.WebauthnPasskeySelection]: "webauthn-passkey-selection",
};
export const WebcardWrapper = (props: WebcardPropsBase) => {
  const { dispatch, nameSpace, langCode } = React.useContext(I18nContext);
  const { data } = props;
  React.useEffect(() => {
    if (dispatch) {
      dispatch({
        type: "setNameSpace",
        payload: translationNamespaceForWebcardType[data.webcardType],
      });
    }
  }, [data.webcardType, dispatch]);
  const shouldDisplayWebcard = Boolean(data && nameSpace && langCode);
  if (!shouldDisplayWebcard) {
    return null;
  }
  const getWebcardComponent = () => {
    switch (data?.webcardType) {
      case WebcardType.FeedbackNotification:
        return <FeedbackNotification {...props} data={data} />;
      case WebcardType.FollowUpNotification:
        return <FollowUpNotification {...props} data={data} />;
      case WebcardType.PhishingPrevention:
        return <PhishingPreventionPrompt {...props} data={data} />;
      case WebcardType.LinkedWebsiteUpdateConfirmation:
        return <LinkedWebsiteUpdateConfirmation {...props} data={data} />;
      case WebcardType.SavePassword:
        return <SavePassword {...props} data={data} />;
      case WebcardType.AutologinSelection:
        return <AutoLoginSelection {...props} data={data} />;
      case WebcardType.AutofillConfirmationPasswordLess:
        return <AutofillConfirmation {...props} data={data} />;
      case WebcardType.DataCapture:
        return <DataCapture {...props} data={data} />;
      case WebcardType.WarnGeneratedPassword:
        return <WarnGeneratedPassword {...props} data={data} />;
      case WebcardType.OnboardingNotification:
        return <Onboarding {...props} data={data} />;
      case WebcardType.WebauthnCreateConfirmation:
        return <WebauthnCreateConfirmation {...props} data={data} />;
      case WebcardType.WebauthnGetConfirmation:
        return <WebauthnGetConfirmation {...props} data={data} />;
      case WebcardType.WebauthnPasskeySelection:
        return <WebauthnPasskeySelection {...props} data={data} />;
      case WebcardType.UserVerification:
        return <UserVerification {...props} data={data} />;
      case WebcardType.B2CFrozenDialog:
        return <B2CFrozenDialog {...props} data={data} />;
      case WebcardType.AutofillDropdown:
        switch (data?.configuration) {
          case AutofillDropdownWebcardConfiguration.GeneratePassword:
            return <GeneratePassword {...props} data={data} />;
          case AutofillDropdownWebcardConfiguration.Reactivation:
            return <Reactivation {...props} data={data} />;
          case AutofillDropdownWebcardConfiguration.WebAuthnReactivation:
            return <WebAuthnReactivation {...props} data={data} />;
          case AutofillDropdownWebcardConfiguration.FieldDisabledNotification:
            return <FieldDisabledNotification {...props} data={data} />;
          case AutofillDropdownWebcardConfiguration.Classic:
            return <Autofill {...props} data={data} />;
          case AutofillDropdownWebcardConfiguration.SelfCorrecting:
            return <SelfCorrectingMenu {...props} data={data} />;
          case AutofillDropdownWebcardConfiguration.AccountFrozen:
            return <B2CFrozenDropdown {...props} data={data} />;
          default:
            return null;
        }
      default:
        return null;
    }
  };
  return getWebcardComponent();
};
