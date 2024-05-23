import * as React from 'react';
import styles from 'components/inputs/login/PinInput/styles.css';
import classNames from 'classnames';
interface Props {
    value: string;
    maxLength: number;
    hasError: boolean;
    labelId?: string;
    a11yLabelId?: string;
    id?: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFocus?: () => void;
}
const PinInput: React.FunctionComponent<Props> = (props: Props) => {
    return (<input autoFocus className={classNames(styles.input, {
            [styles.inputError]: props.hasError,
        })} onChange={props.handleInputChange} type="text" pattern="^\d+$" maxLength={props.maxLength} value={props.value} aria-describedby={props.labelId} onFocus={props.onFocus} id={props.id} aria-label={props.labelId} aria-labelledby={props.a11yLabelId}/>);
};
export default React.memo(PinInput);
