import { Icon, jsx } from '@dashlane/design-system';
import { colors } from '@dashlane/ui-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import Options from 'components/dropdown/Select/Options';
import styles from 'components/dropdown/styles.css';
export interface Option<T extends string = string> {
    label: string;
    value: T;
    active?: boolean;
}
interface Props<T extends string> {
    items: Option<T>[];
    onChange: (value: T) => void;
    optionsTitle?: string;
    listLabel: string;
    small?: boolean;
    hasInputStyle?: boolean;
}
export const Select = <T extends string>({ items, hasInputStyle, listLabel, optionsTitle, small, onChange, }: Props<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const toggleDropdown = useCallback(() => {
        const newOpenState = !isOpen;
        setIsOpen(newOpenState);
    }, [isOpen]);
    const onSelect = (value: T) => {
        setIsSelected(true);
        onChange(value);
        toggleDropdown();
    };
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isOpen && !ref.current?.contains(event.target as HTMLElement)) {
                toggleDropdown();
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, toggleDropdown, ref]);
    return (<div className={styles.container} ref={ref}>
      <button type="button" aria-expanded={isOpen} className={classNames([
            styles.dropdownTitle,
            {
                [styles.smallTitle]: small,
                [styles.inputField]: hasInputStyle,
            },
        ])} onClick={toggleDropdown} sx={{
            display: 'flex',
            alignItems: 'center',
            columnGap: '4px',
        }}>
        <span className={classNames([
            styles.dropdownTitleText,
            {
                [styles.dropdownTitleTextSmall]: small,
                [styles.dropdownTitleTextSelected]: hasInputStyle && isSelected,
                [styles.dropdownTitleSelectPlaceholder]: hasInputStyle,
            },
        ])}>
          {listLabel}
        </span>{' '}
        {hasInputStyle ? (<Icon name="ArrowDownOutlined" size="xsmall"/>) : (<div className={classNames([
                styles.caretDownIcon,
                {
                    [styles.rotateIcon]: open,
                },
            ])}>
            <Icon name="CaretDownOutlined" color="ds.text.neutral.quiet" size="xsmall"/>
          </div>)}
      </button>

      {isOpen && (<Options className={hasInputStyle ? styles.resizedList : ''} items={items} onSelect={onSelect} title={optionsTitle} listboxLabel={listLabel} small={small}/>)}
    </div>);
};
Select.prototype = {};
export default onClickOutside(Select);
