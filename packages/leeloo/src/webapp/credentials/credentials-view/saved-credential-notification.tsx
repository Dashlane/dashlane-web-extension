import React, { useEffect, useState } from "react";
import { WebOnboardingLeelooStep } from "@dashlane/communication";
import { Lee } from "../../../lee";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ActionNotification } from "../../../libs/dashlane-style/action-notification";
import { setOnboardingMode } from "../../onboarding/services";
const I18N_KEYS = {
  NOTIFICATION_SAVE_SUCCESS_TITLE:
    "webapp_onboarding_notification_password_save_success_title",
  NOTIFICATION_SAVE_SUCCESS_DESCRIPTION:
    "webapp_onboarding_notification_password_save_success_description",
  NOTIFICATION_SAVE_SUCCESS_CONFIRM:
    "webapp_onboarding_notification_password_save_success_confirmation",
};
interface Props {
  lee: Lee;
}
export const SavedCredentialNotification = ({ lee }: Props) => {
  const { translate } = useTranslate();
  const [currentWebOnboardingMode, setCurrentWebOnboardingMode] = useState(
    lee.carbon.webOnboardingMode
  );
  useEffect(() => {
    if (APP_PACKAGED_IN_EXTENSION) {
      const nextWebOnboardingMode = lee.carbon.webOnboardingMode;
      if (!currentWebOnboardingMode || !nextWebOnboardingMode) {
        setCurrentWebOnboardingMode(nextWebOnboardingMode);
        return;
      }
      setCurrentWebOnboardingMode(nextWebOnboardingMode);
    }
  }, [lee.carbon.webOnboardingMode]);
  const handlePasswordSaveSuccessConfirm = () => {
    setOnboardingMode({
      activeOnboardingType: "loginWeb",
      leelooStep:
        WebOnboardingLeelooStep.SHOW_LOGIN_USING_EXTENSION_NOTIFICATION,
    });
  };
  const { leelooStep, completedSteps } = lee.carbon.webOnboardingMode;
  return (
    <ActionNotification
      style={{
        left: "32px",
        top: "190px",
      }}
      arrowPosition="topLeft"
      title={translate(I18N_KEYS.NOTIFICATION_SAVE_SUCCESS_TITLE)}
      description={translate(I18N_KEYS.NOTIFICATION_SAVE_SUCCESS_DESCRIPTION)}
      show={
        APP_PACKAGED_IN_EXTENSION &&
        completedSteps?.saveCredentialOnWeb &&
        leelooStep === WebOnboardingLeelooStep.SHOW_PASSWORD_SAVE_SUCCESS
      }
      confirmLabel={translate(I18N_KEYS.NOTIFICATION_SAVE_SUCCESS_CONFIRM)}
      onConfirm={handlePasswordSaveSuccessConfirm}
    />
  );
};
