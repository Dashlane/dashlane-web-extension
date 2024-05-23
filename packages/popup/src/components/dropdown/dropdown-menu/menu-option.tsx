import * as React from 'react';
import styles from 'components/dropdown/styles.css';
import classNames from 'classnames';
interface Props extends React.Props<{}> {
    label: string;
    onClick: () => void;
    isSecondaryOption: boolean;
    isSelectedOption: boolean;
}
const Option = ({ label, onClick, isSelectedOption, isSecondaryOption, }: Props) => {
    return (<li>
      <button type="button" onClick={onClick} className={classNames(styles.dropdownItem, {
            [styles.selectedItem]: isSelectedOption,
            [styles.secondaryItem]: isSecondaryOption,
        })}>
        {label}
      </button>
    </li>);
};
export default React.memo(Option);
