import * as React from 'react';
import classNames from 'classnames';
import { jsx, ThemeUIStyleObject } from '@dashlane/design-system';
import styles from 'components/inputs/common/input/styles.css';
interface Props {
    id: string;
    label: string;
    value: string;
    readonly: boolean;
    inputType: string;
    inputStyle?: ThemeUIStyleObject;
    actions?: React.ReactNode;
}
const Input: React.FunctionComponent<Props> = ({ id, label, value, readonly, inputType, inputStyle, actions, }) => {
    const displayDotsWhenValueHidden = () => {
        switch (id) {
            case 'password':
                return '••••••••••••';
            case 'cardNumber':
                return '•••• •••• •••• ••••';
            case 'securityCode':
                return '•••';
            case 'BIC':
                return '••••••';
            case 'IBAN':
                return '••••••••••••••••';
            default:
                return '••••';
        }
    };
    return (<div className={styles.container}>
      <label className={styles.inputContainer} htmlFor={id}>
        <span className={styles.label}>{label}</span>
        <input id={id} sx={inputStyle ? inputStyle : { color: 'ds.text.neutral.standard' }} className={classNames([styles.input, styles[inputType]])} value={inputType === 'password' ? displayDotsWhenValueHidden() : value} readOnly={readonly} aria-readonly={readonly}/>
      </label>
      {actions && <div className={styles.actionList}>{actions}</div>}
    </div>);
};
export default React.memo(Input);
