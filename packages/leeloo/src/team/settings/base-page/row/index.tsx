import * as React from 'react';
import classNames from 'classnames';
import styles from './styles.css';
interface RowProps {
    labelHelper?: string | JSX.Element | React.ReactNode;
    label: string;
    centerLabel?: boolean;
    children?: React.ReactNode;
}
const Row = ({ label, centerLabel, labelHelper, children }: RowProps) => {
    return (<div className={styles.row}>
      <div className={styles.column}>
        <div className={classNames(styles.label, {
            [styles.centerLabel]: centerLabel,
        })}>
          {label}
        </div>
        {labelHelper ? (<div className={styles.labelHelper}>{labelHelper}</div>) : null}
      </div>
      <div className={styles.column}>{children}</div>
    </div>);
};
export default Row;
