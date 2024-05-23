import * as React from 'react';
import classNames from 'classnames';
import styles from 'components/embedded-notification/styles.css';
interface Props {
    content: string;
}
export const EmbeddedNotification = (props: Props) => {
    return <div className={classNames(styles.notification)}>{props.content}</div>;
};
