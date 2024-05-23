import * as React from 'react';
import classnames from 'classnames';
import styles from './styles.css';
type Props = React.PropsWithChildren<{
    toggleLabel: string;
}>;
export const CollapsibleSection = ({ children, toggleLabel }: Props) => {
    const [isOpen, setIsOpen] = React.useState(false);
    return (<div className={styles.optionsWrapper}>
      <button className={styles.toggleLabel} type="button" onClick={(e) => {
            e.preventDefault();
            setIsOpen((current) => !current);
        }}>
        {toggleLabel}
        <span className={classnames(styles.icon, {
            [styles.openIcon]: isOpen,
        })}/>
      </button>
      <div className={styles.contents}>{isOpen && children}</div>
    </div>);
};
