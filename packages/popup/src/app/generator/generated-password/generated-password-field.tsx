import * as React from "react";
import classNames from "classnames";
import { colors, RefreshIcon, Tooltip } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
import styles from "./generated-password-field.css";
interface Props {
  password: string;
  onRefreshPassword: () => void;
  maxCharsOnOneLineLength?: number;
  isDisabled: boolean;
}
const I18N_KEYS = {
  PASSWORD_REFRESH: "tab/generate/refresh",
};
const GeneratedPasswordFieldComponent: React.FC<Props> = ({
  password,
  onRefreshPassword,
  maxCharsOnOneLineLength = 20,
  isDisabled,
}) => {
  const { translate } = useTranslate();
  const wrapPasswordChars = React.useMemo(() => {
    return password.split("").map((char, i) => {
      return (
        <React.Fragment key={i}>
          {i === maxCharsOnOneLineLength ? <br /> : null}
          <span key={`char-${i}`}>{char}</span>
        </React.Fragment>
      );
    });
  }, [password, maxCharsOnOneLineLength]);
  const handleRefreshClick = React.useCallback(() => {
    onRefreshPassword();
  }, [onRefreshPassword]);
  return (
    <div
      className={classNames(
        styles.container,
        password.length > maxCharsOnOneLineLength
          ? styles["doubleLine"]
          : styles["singleLine"]
      )}
    >
      <div
        id="passwordGeneratorText"
        className={styles.password}
        style={{
          transition: "opacity 0.1s ease",
        }}
      >
        {wrapPasswordChars}
      </div>
      <Tooltip placement="left" content={translate(I18N_KEYS.PASSWORD_REFRESH)}>
        <button
          id="refreshButton"
          type="button"
          className={styles.refresh}
          onClick={handleRefreshClick}
          disabled={isDisabled}
        >
          <RefreshIcon hoverColor={colors.midGreen00} />
        </button>
      </Tooltip>
    </div>
  );
};
export const GeneratedPasswordField = React.memo(
  GeneratedPasswordFieldComponent
);
