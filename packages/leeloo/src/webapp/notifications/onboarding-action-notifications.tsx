import React, { useEffect } from "react";
import { PageView } from "@dashlane/hermes";
import {
  WebOnboardingLeelooStep,
  WebOnboardingPopoverStep,
} from "@dashlane/communication";
import { ActionNotification } from "../../libs/dashlane-style/action-notification";
import extensionPinningImg from "../../libs/dashlane-style/action-notification/chrome-pinning.svg";
import useTranslate from "../../libs/i18n/useTranslate";
import { logPageView } from "../../libs/logs/logEvent";
import { isChromiumExtension, isInEdgeExtension } from "../../libs/extension";
import { setOnboardingMode } from "../onboarding/services";
interface Props {
  flowLoginCredentialOnWeb?: boolean;
  leelooStep?: WebOnboardingLeelooStep | null;
  popoverStep?: WebOnboardingPopoverStep | null;
}
export const OnboardingActionNotifications = ({
  flowLoginCredentialOnWeb,
  leelooStep,
  popoverStep,
}: Props) => {
  const { translate } = useTranslate();
  const isExtensionWebOnboardingEnabled = () => {
    return APP_PACKAGED_IN_EXTENSION;
  };
  const showExtensionWebCard =
    isExtensionWebOnboardingEnabled() &&
    flowLoginCredentialOnWeb &&
    leelooStep ===
      WebOnboardingLeelooStep.SHOW_LOGIN_USING_EXTENSION_NOTIFICATION &&
    popoverStep === null;
  const showBrowserPinningWebCard =
    showExtensionWebCard &&
    isChromiumExtension(window.location.href) &&
    !isInEdgeExtension(window.location.href);
  const showDefaultExtensionWebCard =
    showExtensionWebCard && !isChromiumExtension(window.location.href);
  useEffect(() => {
    if (showBrowserPinningWebCard) {
      logPageView(PageView.NotificationOnboardingPinExtension);
    }
  }, [showBrowserPinningWebCard]);
  const onChromePinningDismiss = () => {
    setOnboardingMode({
      popoverStep: WebOnboardingPopoverStep.SHOW_LOGIN_NOTIFICATION,
      leelooStep: null,
      activeOnboardingType: "loginWeb",
    });
  };
  return (
    <>
      <ActionNotification
        title={translate("webapp_onboarding_notification_chrome_pinning_title")}
        secondTitle={translate(
          "webapp_onboarding_notification_chrome_pinning_subtitle"
        )}
        imageSrc={extensionPinningImg}
        show={showBrowserPinningWebCard}
        cancelLabel={translate(
          "webapp_onboarding_notification_chrome_pinning_cancel"
        )}
        onCancel={onChromePinningDismiss}
      />
      <ActionNotification
        title={translate("webapp_onboarding_notification_login_sites_title")}
        show={showDefaultExtensionWebCard}
      />
    </>
  );
};
