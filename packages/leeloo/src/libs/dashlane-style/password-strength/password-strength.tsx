import * as React from "react";
import { EvaluatePasswordStrength } from "../../validators";
import useTranslate from "../../i18n/useTranslate";
import styles from "./styles/index.css";
export interface Props {
  firstPasswordStrength: EvaluatePasswordStrength;
  className: string;
}
const I18N_KEYS = {
  HEADLINE: "account_creation_password_strength_strong_passwords_include",
  LOWER_CASE: "account_creation_password_strength_lower_case",
  UPPER_CASE: "account_creation_password_strength_upper_case",
  NUMERIC: "account_creation_password_strength_has_numeric",
  MEETS_LENGTH: "account_creation_password_strength_strength",
};
export const PasswordStrength = (props: Props) => {
  const { translate } = useTranslate();
  const getCheckedStateFromRule = (rule: boolean): string =>
    rule ? styles.checked : styles.unchecked;
  return (
    <div className={props.className}>
      <h3 className={styles.headline}>{translate(I18N_KEYS.HEADLINE)}</h3>
      <ul className={styles.list}>
        <li
          className={getCheckedStateFromRule(
            props.firstPasswordStrength.hasLowerCase
          )}
        >
          {translate(I18N_KEYS.LOWER_CASE)}
        </li>
        <li
          className={getCheckedStateFromRule(
            props.firstPasswordStrength.hasUpperCase
          )}
        >
          {translate(I18N_KEYS.UPPER_CASE)}
        </li>
        <li
          className={getCheckedStateFromRule(
            props.firstPasswordStrength.hasNumeric
          )}
        >
          {translate(I18N_KEYS.NUMERIC)}
        </li>
        <li
          className={getCheckedStateFromRule(
            props.firstPasswordStrength.meetsLength
          )}
        >
          {translate(I18N_KEYS.MEETS_LENGTH)}
        </li>
      </ul>
    </div>
  );
};
