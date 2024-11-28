import * as React from "react";
import { Button } from "@dashlane/ui-components";
import LoaderIcon from "../../../components/icons/loader.svg";
import styles from "./styles.css";
export interface FormActionsProps {
  isLoading: boolean;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onSecondaryButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  primaryButtonIsDisabled?: boolean;
  hideSecondaryButton?: boolean;
  showSuccessMessage?: boolean;
}
const FormActions: React.FunctionComponent<FormActionsProps> = (
  props: FormActionsProps
) => {
  const showSecondButton =
    !props.hideSecondaryButton &&
    props.secondaryButtonText &&
    props.onSecondaryButtonClick;
  const getSecondElement = (): JSX.Element | null => {
    if (!showSecondButton) {
      return null;
    }
    if (props.showSuccessMessage) {
      return (
        <div className={styles.successMessage}>{props.secondaryButtonText}</div>
      );
    }
    return (
      <Button
        className={styles.button}
        onClick={props.onSecondaryButtonClick}
        type="button"
        nature="secondary"
        theme="dark"
        size="large"
      >
        {props.secondaryButtonText}
      </Button>
    );
  };
  return (
    <div className={styles.actionsContainer}>
      <Button
        type="submit"
        className={styles.button}
        disabled={props.primaryButtonIsDisabled || props.isLoading}
        nature="primary"
        size="large"
        theme="dark"
      >
        {props.isLoading ? <LoaderIcon /> : props.primaryButtonText}
      </Button>

      {getSecondElement()}
    </div>
  );
};
export default React.memo(FormActions);
