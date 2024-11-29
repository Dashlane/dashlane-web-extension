import classnames from "classnames";
import styles from "../styles.css";
interface Props {
  message: string;
  leftIcon: JSX.Element;
  rightIcon: JSX.Element;
}
export const CompletedStep = ({ message, leftIcon, rightIcon }: Props) => {
  return (
    <span
      className={classnames(
        styles.baseComponent,
        styles.completedOnboardingStep
      )}
    >
      <div className={styles.leftIcon}>{leftIcon} </div>
      <div>
        <p
          className={styles.completedOnboardingStepHeader}
          sx={{
            color: "ds.text.inverse.standard",
          }}
        >
          {message}
        </p>
      </div>
      <div className={styles.rightIcon}>{rightIcon} </div>
    </span>
  );
};
