import * as React from 'react';
import { ThemeEnum } from 'libs/helpers-types';
import styles from 'components/inputs/login/InputWithMessageWrapper/styles.css';
import classNames from 'classnames';
export enum MessageType {
    Error = 'error'
}
interface Props {
    message?: string;
    type: MessageType;
    theme?: ThemeEnum;
}
type InputProps = React.PropsWithChildren<Props>;
const InputWithMessage: React.FunctionComponent<InputProps> = (props: InputProps) => {
    const classNamesMap: {
        [type in MessageType]: string;
    } = {
        [MessageType.Error]: props.theme === ThemeEnum.Dark
            ? styles.darkErrorText
            : styles.lightErrorText,
    };
    return (<>
      {props.children}
      {props.message && (<div className={classNames([
                styles.messageText,
                classNamesMap[props.type],
            ])} id="login-feedback-text">
          {props.message}
        </div>)}
    </>);
};
export default InputWithMessage;
