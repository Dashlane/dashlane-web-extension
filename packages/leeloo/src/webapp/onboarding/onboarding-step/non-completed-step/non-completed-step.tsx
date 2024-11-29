import React from "react";
import { Link } from "../../../../libs/router";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import classnames from "classnames";
import styles from "../styles.css";
import cssVariables from "../../../variables.css";
import onboardingTransitions from "../../onboarding-transitions.css";
const onboardingTransitionTimeouts = {
  enter: parseInt(cssVariables["--transition-duration-arriving"], 10),
  exit: parseInt(cssVariables["--transition-duration-leaving"], 10),
};
const KEY_PREFIX = "for-CSSTransition-";
interface Props {
  message: string;
  onOnboardingStepClick?: () => void;
  messageOnHover?: string;
  path?: string;
  leftIcon: JSX.Element;
  rightIcon: JSX.Element;
  messageOnError?: string | null;
}
export const NonCompletedStep = ({
  message,
  onOnboardingStepClick,
  messageOnHover,
  path,
  leftIcon,
  rightIcon,
  messageOnError,
}: Props) => {
  const rightIconElement = () =>
    messageOnError ? (
      <div key={`${KEY_PREFIX}error`} className={styles.messageOnError}>
        {messageOnError}
      </div>
    ) : (
      <div key={`${KEY_PREFIX}icon`} className={styles.rightIcon}>
        {rightIcon}
      </div>
    );
  return (
    <Link
      to={path || ""}
      onClick={onOnboardingStepClick}
      className={classnames(
        styles.baseComponent,
        styles.stepWrapper,
        styles.onboardingStep
      )}
    >
      <div className={styles.leftIcon}>{leftIcon}</div>
      <div className={styles.messageWrapper}>
        <div className={styles.messageContent}>
          <p className={styles.onboardingStepHeader}>{message}</p>
          {messageOnHover ? (
            <p className={styles.messageOnHover}>{messageOnHover}</p>
          ) : null}
        </div>
      </div>
      <SwitchTransition>
        <CSSTransition
          key={messageOnError ? `${KEY_PREFIX}error` : `${KEY_PREFIX}icon`}
          timeout={onboardingTransitionTimeouts}
          classNames={onboardingTransitions}
        >
          {rightIconElement()}
        </CSSTransition>
      </SwitchTransition>
    </Link>
  );
};
