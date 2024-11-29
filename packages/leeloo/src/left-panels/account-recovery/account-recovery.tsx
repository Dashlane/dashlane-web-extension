import classnames from "classnames";
import { CheckIcon, colors, Heading, Paragraph } from "@dashlane/ui-components";
import useTranslate from "../../libs/i18n/useTranslate";
import { BasePanelContainer } from "../base-panel-container";
import { AccountRecoveryStep } from "../../account-recovery/admin-assisted-recovery/types";
import styles from "./account-recovery.css";
const I18N_KEYS = {
  ACCOUNT_RECOVERY_MARKETING_HEADER:
    "webapp_account_recovery_marketing_heading",
  ACCOUNT_RECOVERY_MARKETING_SUBHEADER:
    "webapp_account_recovery_marketing_subheading",
  ACCOUNT_RECOVERY_STEP_1: "webapp_account_recovery_marketing_step_1",
  ACCOUNT_RECOVERY_STEP_2: "webapp_account_recovery_marketing_step_2",
  ACCOUNT_RECOVERY_STEP_3: "webapp_account_recovery_marketing_step_3",
};
interface AccountRecoveryMarketingContainerProps {
  step: AccountRecoveryStep;
}
export const AccountRecoveryMarketingContainer = ({
  step,
}: AccountRecoveryMarketingContainerProps) => {
  const { translate } = useTranslate();
  let iconStateStep1;
  let iconStateStep2;
  let iconStateStep3;
  let textColorStep1;
  let textColorStep2;
  let textColorStep3;
  switch (step) {
    case AccountRecoveryStep.VERIFY_ACCOUNT:
      iconStateStep1 = (
        <div className={classnames(styles.stepIcon, styles.stepActive)}>1</div>
      );
      iconStateStep2 = (
        <div className={classnames(styles.stepIcon, styles.stepNonActive)}>
          2
        </div>
      );
      iconStateStep3 = (
        <div className={classnames(styles.stepIcon, styles.stepNonActive)}>
          3
        </div>
      );
      textColorStep1 = colors.dashGreen00;
      textColorStep2 = colors.dashGreen00;
      textColorStep3 = colors.dashGreen00;
      break;
    case AccountRecoveryStep.CREATE_MASTER_PASSWORD:
      iconStateStep1 = (
        <div className={classnames(styles.stepIcon, styles.stepChecked)}>
          <CheckIcon size={16} color={colors.white} />
        </div>
      );
      iconStateStep2 = (
        <div className={classnames(styles.stepIcon, styles.stepActive)}>2</div>
      );
      iconStateStep3 = (
        <div className={classnames(styles.stepIcon, styles.stepNonActive)}>
          3
        </div>
      );
      textColorStep1 = colors.dashGreen02;
      textColorStep2 = colors.dashGreen00;
      textColorStep3 = colors.dashGreen00;
      break;
    case AccountRecoveryStep.ACCOUNT_RECOVERY_REQUEST:
      iconStateStep1 = (
        <div className={classnames(styles.stepIcon, styles.stepChecked)}>
          <CheckIcon size={16} color={colors.white} />
        </div>
      );
      iconStateStep2 = (
        <div className={classnames(styles.stepIcon, styles.stepChecked)}>
          <CheckIcon size={16} color={colors.white} />
        </div>
      );
      iconStateStep3 = (
        <div className={classnames(styles.stepIcon, styles.stepActive)}>3</div>
      );
      textColorStep1 = colors.dashGreen02;
      textColorStep2 = colors.dashGreen02;
      textColorStep3 = colors.dashGreen00;
      break;
    default:
      break;
  }
  return (
    <BasePanelContainer>
      <div className={styles.marketingContent}>
        <div className={styles.marketingInner}>
          <Heading caps={true} size="large">
            {translate(I18N_KEYS.ACCOUNT_RECOVERY_MARKETING_HEADER)}
          </Heading>
          <Paragraph sx={{ paddingTop: "24px" }} size="large">
            {translate(I18N_KEYS.ACCOUNT_RECOVERY_MARKETING_SUBHEADER)}
          </Paragraph>
          <div className={styles.stepsContainer}>
            <div className={styles.step}>
              {iconStateStep1}
              <Paragraph
                sx={{ padding: "12px" }}
                size="large"
                color={textColorStep1}
              >
                {translate(I18N_KEYS.ACCOUNT_RECOVERY_STEP_1)}
              </Paragraph>
            </div>
            <div className={styles.verticalLine} />
            <div className={styles.step}>
              {iconStateStep2}
              <Paragraph
                sx={{ padding: "12px" }}
                size="large"
                color={textColorStep2}
              >
                {translate(I18N_KEYS.ACCOUNT_RECOVERY_STEP_2)}
              </Paragraph>
            </div>
            <div className={styles.verticalLine} />
            <div className={styles.step}>
              {iconStateStep3}
              <Paragraph
                sx={{ padding: "12px" }}
                size="large"
                color={textColorStep3}
              >
                {translate(I18N_KEYS.ACCOUNT_RECOVERY_STEP_3)}
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </BasePanelContainer>
  );
};
