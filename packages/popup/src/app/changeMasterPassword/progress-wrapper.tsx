import * as React from "react";
import { Button } from "@dashlane/ui-components";
import useTranslate from "../../libs/i18n/useTranslate";
import styles from "./progress-wrapper.css";
import { Logo } from "@dashlane/design-system";
export interface Props {
  description: string;
  subdescription?: string;
  icon?: React.ReactNode;
  progressValue?: number;
  actionButtonText?: string;
  handleAction?: () => void;
}
const I18N_KEYS = {
  LOGO_TITLE: "common/dashlane_logo_title",
};
export const Progress = ({
  description,
  subdescription,
  icon,
  progressValue,
  actionButtonText,
  handleAction,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <div className={styles.progressContainer}>
      <div className={styles.contentWithLogo}>
        <Logo
          height={40}
          name="DashlaneLockup"
          title={translate(I18N_KEYS.LOGO_TITLE)}
          color="ds.text.inverse.catchy"
        />
        <div className={styles.content}>
          {icon ? <span className={styles.icon}>{icon}</span> : null}

          <h1 className={styles.description}>
            {description}{" "}
            {progressValue ? <span>({progressValue}%)</span> : null}
          </h1>

          {subdescription ? (
            <p className={styles.subDescription}>{subdescription}</p>
          ) : null}
        </div>
      </div>

      {actionButtonText && handleAction ? (
        <div className={styles.action}>
          <Button
            type="button"
            className={styles.actionButton}
            nature="primary"
            size="large"
            theme="dark"
            onClick={handleAction}
          >
            {actionButtonText}
          </Button>
        </div>
      ) : null}
    </div>
  );
};
