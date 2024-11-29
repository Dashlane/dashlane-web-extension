import { PropsWithChildren, useEffect, useState } from "react";
import classnames from "classnames";
import { Icon, IndeterminateLoader } from "@dashlane/design-system";
import { AnimationStatus } from "./sync-action";
import styles from "./sync-action-button.css";
export const DEFAULT_ANIMATION_DURATION = 2000;
const StatusComponent = ({ status }: { status: AnimationStatus }) => {
  switch (status) {
    case AnimationStatus.Error:
      return (
        <Icon
          size="medium"
          name="FeedbackFailOutlined"
          color="ds.text.danger.quiet"
        />
      );
    case AnimationStatus.Success:
      return (
        <Icon
          size="medium"
          name="FeedbackSuccessOutlined"
          color="ds.text.positive.quiet"
        />
      );
    case AnimationStatus.Loading:
      return (
        <IndeterminateLoader
          mood="neutral"
          sx={{
            position: "relative",
            bottom: "3px",
            margin: "0 1px 0 1px",
            width: "18px",
            height: "18px",
          }}
        />
      );
    default:
      return null;
  }
};
export interface SyncActionButtonProps {
  onClick: () => void;
  status: AnimationStatus;
  animationDuration?: number;
}
export const SyncActionButton = ({
  onClick,
  status,
  children,
  animationDuration = DEFAULT_ANIMATION_DURATION,
}: PropsWithChildren<SyncActionButtonProps>) => {
  const [statusExpired, setStatusExpired] = useState<boolean>(false);
  useEffect(() => {
    let timeout = 0;
    if ([AnimationStatus.Success, AnimationStatus.Error].includes(status)) {
      timeout = window.setTimeout(
        () => setStatusExpired(true),
        animationDuration
      );
    } else {
      setStatusExpired(false);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [animationDuration, status]);
  const buttonClassNames = classnames(
    styles.button,
    status === "loading" && styles.loading,
    status === "success" && styles.success,
    status === "error" && styles.error
  );
  return (
    <button type="button" className={buttonClassNames} onClick={onClick}>
      {children}
      {status !== "idle" && !statusExpired ? (
        <div
          className={styles.icon}
          data-testid="syncIcon"
          style={{
            animationDuration:
              status !== "loading" ? `${animationDuration}ms` : undefined,
          }}
          role="alert"
          aria-label={status}
        >
          <StatusComponent status={status} />
        </div>
      ) : null}
    </button>
  );
};
