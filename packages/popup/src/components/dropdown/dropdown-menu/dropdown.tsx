import * as React from 'react';
import onClickOutside from 'react-onclickoutside';
import classNames from 'classnames';
import { jsx } from '@dashlane/design-system';
import { CaretDownIcon, colors } from '@dashlane/ui-components';
import Option from 'src/components/dropdown/dropdown-menu/menu-option';
import { ThemeEnum } from 'libs/helpers-types';
import styles from 'components/dropdown/styles.css';
import useID from 'src/libs/hooks/useId';
export interface MenuItem {
    label: string;
    onClick: () => void;
    isSecondaryOption: boolean;
}
interface DropdownProps {
    items: MenuItem[];
    title: string;
    small?: boolean;
    inversed?: boolean;
    onOpen?: () => void;
    theme?: ThemeEnum;
}
const Dropdown = ({ items, title, small, inversed, onOpen, theme, }: DropdownProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const accessibilityId = useID();
    const toggleDropdown = () => {
        setIsOpen((prevValue) => !prevValue);
        if (onOpen) {
            onOpen();
        }
    };
    const onClickMenuItem = (menuItemOnClick: () => void): (() => void) => {
        return () => {
            menuItemOnClick();
            toggleDropdown();
        };
    };
    const caretIconColors = theme === ThemeEnum.Dark
        ? {
            color: isOpen ? colors.midGreen02 : colors.dashGreen04,
            activeColor: colors.midGreen02,
        }
        : {
            color: isOpen ? colors.midGreen00 : colors.grey00,
            activeColor: colors.midGreen00,
        };
    const textColors = theme === ThemeEnum.Dark
        ? 'ds.text.inverse.standard'
        : 'ds.text.brand.standard';
    Dropdown.handleClickOutside = () => {
        setIsOpen(false);
    };
    return (<div className={styles.container}>
      <button type="button" aria-expanded={isOpen} aria-controls={accessibilityId} data-testid="component-dropdown-title-popup" sx={{
            color: textColors,
            cursor: 'pointer',
            display: 'flex',
            maxWidth: '100%',
        }} onClick={toggleDropdown}>
        <span className={classNames([
            styles.dropdownTitleText,
            {
                [styles.dropdownTitleTextSmall]: small,
            },
        ])}>
          {title}
        </span>{' '}
        <div className={classNames([
            styles.caretDownIcon,
            {
                [styles.rotateIcon]: isOpen,
                [styles.inversedIcon]: inversed,
                [styles.rotateInversedIcon]: isOpen && inversed,
            },
        ])}>
          <CaretDownIcon color={caretIconColors.color} activeColor={caretIconColors.activeColor} hoverColor={caretIconColors.activeColor}/>
        </div>
      </button>

      {isOpen ? (<ul className={classNames(styles.menuList, {
                [styles.smallList]: small,
                [styles.directList]: !inversed,
                [styles.inversedList]: inversed,
            })} id={accessibilityId}>
          {items.map((item, idx) => (<Option key={`${item.label}-${idx}`} label={item.label} onClick={onClickMenuItem(item.onClick)} isSecondaryOption={item.isSecondaryOption} isSelectedOption={title === item.label}/>))}
        </ul>) : null}
    </div>);
};
Dropdown.prototype = {};
Dropdown.handleClickOutside = () => { };
export default onClickOutside(Dropdown, {
    handleClickOutside: () => Dropdown.handleClickOutside,
});
