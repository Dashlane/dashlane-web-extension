import * as React from 'react';
import classnames from 'classnames';
import styles from './styles.css';
export type MarginSide = 'left' | 'right' | 'none';
export type IconPosition = 'left' | 'right';
export interface Props {
    buttonRef?: React.Ref<HTMLButtonElement>;
    classNames?: string[];
    closeDropdown?: boolean;
    darkClassName?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    icon?: React.ReactNode;
    iconPosition?: IconPosition;
    iconButton?: boolean;
    iconClassName?: string | string[];
    iconHover?: React.ReactNode;
    label?: React.ReactNode;
    labelClassName?: string | string[];
    loading?: boolean;
    marginSide?: MarginSide;
    mode?: 'dark' | 'light';
    noCloseDropdown?: boolean;
    size?: 'small' | 'medium' | 'large';
    spinnerClassName?: string;
    style?: React.CSSProperties;
    title?: string;
    type?: 'button' | 'submit' | 'reset';
}
export type ButtonProps = Props & React.ButtonHTMLAttributes<HTMLButtonElement>;
const StandardButton = ({ marginSide = 'none', size = 'medium', mode = 'light', iconButton, classNames = [], fullWidth = false, darkClassName, type, iconClassName, closeDropdown, noCloseDropdown, icon, iconHover, iconPosition = 'left', labelClassName, spinnerClassName, disabled, loading, buttonRef, onClick, style, title, label, ...props }: ButtonProps) => {
    const className = classnames(styles.button, styles[marginSide], {
        [styles.small]: size === 'small',
        [styles.medium]: size === 'medium',
        [styles.large]: size === 'large',
        [styles.icon]: iconButton,
        [styles.fullWidth]: fullWidth,
    }, {
        ...(darkClassName
            ? {
                [darkClassName]: mode === 'dark',
            }
            : {}),
    }, ...classNames);
    const btnType = type || 'button';
    const onDropdownAttributes = {
        'data-close-dropdown': closeDropdown,
        'data-no-close-dropdown': noCloseDropdown,
    };
    const iconComponent = (<span className={classnames(styles.iconContainer, iconClassName)} {...onDropdownAttributes}>
      <span className={styles.icon} {...onDropdownAttributes}>
        {icon}
      </span>
      <span className={styles.iconHover} {...onDropdownAttributes}>
        {iconHover || icon}
      </span>
    </span>);
    const content = (<span className={classnames(styles.labelContainer, labelClassName)} {...onDropdownAttributes}>
      {loading ? (<span className={classnames(styles.loading, spinnerClassName)}/>) : null}
      <span className={classnames(styles.buttonContents, {
            [styles.hiddenContent]: loading,
        })} {...onDropdownAttributes}>
        {icon ? (<div className={iconPosition === 'left'
                ? styles.iconPositionRow
                : styles.iconPositionRowReverse} {...onDropdownAttributes}>
            {iconComponent}
            {label}
          </div>) : (label)}
      </span>
    </span>);
    return (<button className={className} data-close-dropdown={closeDropdown} data-no-close-dropdown={noCloseDropdown} disabled={loading || disabled} onClick={onClick} ref={buttonRef} style={style} type={btnType} title={title} {...props}>
      {content}
    </button>);
};
export default StandardButton;
