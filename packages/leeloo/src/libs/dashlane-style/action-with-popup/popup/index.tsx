import * as React from 'react';
import classnames from 'classnames';
import { OutsideClickHandler } from 'libs/outside-click-handler/outside-click-handler';
import styles from './styles.css';
interface Props {
    className?: string;
    onClickOutside: () => void;
}
const Popup = (props: React.PropsWithChildren<Props>) => (<OutsideClickHandler onOutsideClick={props.onClickOutside}>
    <div className={classnames(styles.popupContainer, props.className)}>
      {props.children}
    </div>
  </OutsideClickHandler>);
export default Popup;
