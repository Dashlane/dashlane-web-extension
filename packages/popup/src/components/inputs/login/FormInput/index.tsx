import * as React from 'react';
import classNames from 'classnames';
import { ThemeEnum } from 'libs/helpers-types';
import styles from 'components/inputs/login/FormInput/styles.css';
interface Props {
    value: string;
    name?: string;
    hasError: boolean;
    placeholder: string;
    inputType: string;
    isDisabled?: boolean;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    maxLength?: number;
    ariaLabelledBy?: string;
    hasSecretInputStyle?: boolean;
    theme?: ThemeEnum;
}
const FormInput: React.FunctionComponent<React.PropsWithChildren<Props>> = (props: React.PropsWithChildren<Props>) => {
    const input = React.useRef<HTMLInputElement>(null);
    React.useEffect(() => {
        const currentInput = input.current;
        if (!currentInput) {
            throw new Error('input ref not set');
        }
        if (props.isDisabled) {
            return;
        }
        currentInput.focus();
    }, [props.isDisabled]);
    return (<div className={styles.container}>
      <div className={classNames([
            styles.fieldContainer,
            {
                [styles.darkFieldError]: props.hasError && props.theme === ThemeEnum.Dark,
                [styles.lightFieldError]: props.hasError && props.theme === ThemeEnum.Light,
            },
        ])}>
        <input ref={input} name={props.name} value={props.value} className={classNames(styles.formInput, {
            [styles.secretInput]: props.hasSecretInputStyle,
            [styles.lightInput]: props.theme === ThemeEnum.Light,
        })} type={props.inputType} placeholder={props.placeholder} onChange={props.handleChange} aria-labelledby={props.ariaLabelledBy} maxLength={props.maxLength} required={props.required} disabled={props.isDisabled}/>
        {props.children}
      </div>
    </div>);
};
export default React.memo(FormInput);
