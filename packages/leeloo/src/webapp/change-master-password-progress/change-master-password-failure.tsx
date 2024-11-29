import React from "react";
import { Button } from "@dashlane/ui-components";
import useTranslate from "../../libs/i18n/useTranslate";
import { Progress } from "./progress-wrapper";
import failureLottie from "../../libs/assets/lottie-failure.json";
import styles from "./change-master-password-failure.css";
interface Props {
  progressValue: number;
  onBack: () => void;
}
const I18N_KEYS = {
  DESCRIPTION: "webapp_account_security_settings_changemp_error_desc",
  SUB_DESCRIPTION: "webapp_account_security_settings_changemp_error_sub_desc",
  BUTTON_GO_BACK_VAULT:
    "webapp_account_security_settings_changemp_error_button_goback",
};
export const ChangeMasterPasswordFailure = ({
  progressValue,
  onBack,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <Progress
      description={translate(I18N_KEYS.DESCRIPTION)}
      subdescription={translate(I18N_KEYS.SUB_DESCRIPTION)}
      animation={failureLottie}
      progressValue={progressValue}
    >
      <section className={styles.actionsSection}>
        <Button type="button" nature="primary" size="small" onClick={onBack}>
          {translate(I18N_KEYS.BUTTON_GO_BACK_VAULT)}
        </Button>
      </section>
    </Progress>
  );
};
