import React from "react";
import useTranslate from "../../libs/i18n/useTranslate";
import { Progress } from "./progress-wrapper";
import loadingLottie from "../../libs/assets/lottie-loading.json";
interface Props {
  progressValue: number;
}
const I18N_KEYS = {
  DESCRIPTION: "webapp_account_security_settings_changemp_loading_desc",
  SUB_DESCRIPTION: "webapp_account_security_settings_changemp_loading_warning",
};
export const ChangeMasterPasswordLoading = ({ progressValue }: Props) => {
  const { translate } = useTranslate();
  return (
    <Progress
      description={translate(I18N_KEYS.DESCRIPTION)}
      subdescription={translate(I18N_KEYS.SUB_DESCRIPTION)}
      animation={loadingLottie}
      shouldLoopAnimation={true}
      progressValue={progressValue}
    />
  );
};
