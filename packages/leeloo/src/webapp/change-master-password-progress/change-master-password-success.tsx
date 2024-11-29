import React from "react";
import { Button, Infobox } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
import { Progress } from "./progress-wrapper";
import successLottie from "../../libs/assets/lottie-success.json";
import styles from "./change-master-password-success.css";
interface Props {
  progressValue: number;
  onDone: () => void;
}
const I18N_KEYS = {
  DESCRIPTION: "webapp_account_security_settings_changemp_success_desc",
  BUTTON_DONE: "webapp_account_security_settings_changemp_success_button_done",
  TIP_GENERATE_NEW_RECOVERY_KEY:
    "webapp_account_security_settings_tip_generate_new_recovery_key",
};
export const ChangeMasterPasswordSuccess = ({
  progressValue,
  onDone,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <Progress
      description={translate(I18N_KEYS.DESCRIPTION)}
      animation={successLottie}
      progressValue={progressValue}
    >
      <section className={styles.actionsSection}>
        <Button type="button" size="small" onClick={onDone}>
          {translate(I18N_KEYS.BUTTON_DONE)}
        </Button>
      </section>

      <Infobox
        className={styles.infoboxTip}
        title={translate(I18N_KEYS.TIP_GENERATE_NEW_RECOVERY_KEY)}
        mood="brand"
      />
    </Progress>
  );
};
