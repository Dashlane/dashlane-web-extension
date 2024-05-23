import * as React from 'react';
import classNames from 'classnames';
import styles from 'components/checkbox/styles.css';
import { ThemeEnum } from 'libs/helpers-types';
import Checkmark from 'components/checkbox/checkmark.svg';
import useID from 'src/libs/hooks/useId';
interface CheckboxProps {
    checked: boolean;
    label: React.ReactNode;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    theme?: ThemeEnum;
}
const KEYS = {
    WHITE_SPACE: ' ',
};
export const Checkbox = ({ checked, label, onChange, disabled, theme, }: CheckboxProps) => {
    const _onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };
    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === KEYS.WHITE_SPACE) {
            onChange(!checked);
        }
    };
    const accessibilityId = useID();
    return (<label className={styles.label}>
      <input checked={checked} disabled={disabled} className={styles.checkbox} onChange={_onChange} type="checkbox"/>
      <div tabIndex={0} onKeyPress={handleKeyPress} className={classNames(styles.tickbox, {
            [styles.darkTickbox]: theme === ThemeEnum.Dark,
            [styles.tickboxChecked]: checked,
            [styles.darkTickboxChecked]: checked && theme === ThemeEnum.Dark,
        })} role="checkbox" aria-checked={checked} aria-labelledby={accessibilityId} data-testid="master-password-checkbox">
        {checked ? <Checkmark /> : null}
      </div>
      <span className={classNames(styles.text, {
            [styles.darkText]: theme === ThemeEnum.Dark,
        })} id={accessibilityId}>
        {label}
      </span>
    </label>);
};
