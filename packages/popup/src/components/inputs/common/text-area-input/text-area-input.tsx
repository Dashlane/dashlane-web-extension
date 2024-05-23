import * as React from 'react';
import styles from 'components/inputs/common/text-area-input/styles.css';
interface Props {
    id: string;
    label: string;
    value: string;
    isItemHidden?: boolean;
    actions?: React.ReactNode;
}
const TextareaInput: React.FunctionComponent<Props> = ({ id, label, value, isItemHidden, actions, }) => {
    return (<div className={styles.container}>
      <label className={styles.textareaContainer} htmlFor={id}>
        <span className={styles.label}>{label}</span>
        <div className={styles.textarea}>
          {isItemHidden ? (<span className={styles.hiddenText}>••••</span>) : (value)}
        </div>
      </label>
      {actions ? <div className={styles.actionList}>{actions}</div> : null}
    </div>);
};
export default React.memo(TextareaInput);
