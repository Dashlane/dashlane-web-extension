import * as React from 'react';
import styles from 'components/dropdown/styles.css';
interface Props<T extends string> {
    label: string;
    value: T;
    active: boolean;
    onSelect: (value: T) => void;
}
const Option = <T extends string>({ label, value, active, onSelect, }: Props<T>) => {
    const onClick = () => onSelect(value);
    return (<li>
      <button role="option" type="button" aria-selected={active} onClick={onClick} className={styles.dropdownItem}>
        {label}
      </button>
    </li>);
};
export default Option;
