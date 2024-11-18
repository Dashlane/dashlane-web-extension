import * as React from "react";
import classNames from "classnames";
import { ThemeEnum } from "../../../../libs/helpers-types";
import styles from "./styles.css";
export enum MessageType {
  Error = "error",
}
interface Props {
  message?: string;
  type: MessageType;
  theme?: ThemeEnum;
}
type InputProps = React.PropsWithChildren<Props>;
const InputWithMessage: React.FunctionComponent<InputProps> = (
  props: InputProps
) => {
  const classNamesMap: {
    [type in MessageType]: string;
  } = {
    [MessageType.Error]:
      props.theme === ThemeEnum.Dark
        ? styles.darkErrorText
        : styles.lightErrorText,
  };
  return (
    <>
      {props.children}
      {props.message && (
        <div
          className={classNames([
            styles.messageText,
            classNamesMap[props.type],
          ])}
          id="login-feedback-text"
        >
          {props.message}
        </div>
      )}
    </>
  );
};
export default InputWithMessage;
