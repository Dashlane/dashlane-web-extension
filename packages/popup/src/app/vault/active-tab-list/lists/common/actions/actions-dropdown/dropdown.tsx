import React, { forwardRef, MouseEventHandler } from 'react';
import { CopyIcon, DropdownMenu } from '@dashlane/ui-components';
import { DropdownType, ItemType, UserOpenVaultItemDropdownEvent, } from '@dashlane/hermes';
import { VaultItemType } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent } from 'libs/logs/logEvent';
import { vaultItemTypeToHermesItemTypeMap } from 'src/app/helpers';
import { IconButtonWithTooltip } from 'src/components/icon-button-with-tooltip/icon-button-with-tooltip';
const I18N_KEYS = {
    COPY_INFO_TOOLTIP: 'tab/all_items/credential/actions/copy_button_tooltip',
    NO_INFO: 'tab/all_items/credential/actions/no_info',
};
export interface DropdownProps {
    children: JSX.Element;
    isOpen: boolean;
    itemType: VaultItemType;
    setIsOpen: (open: boolean) => void;
    isDisabled?: boolean;
    onKeyDown?: (event: React.KeyboardEvent) => void;
}
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>((props: DropdownProps, ref) => {
    const { translate } = useTranslate();
    const { isDisabled = false, isOpen, setIsOpen, itemType, children, ...rest } = props;
    const toggleDropdown: MouseEventHandler = (event) => {
        event.stopPropagation();
        event.preventDefault();
        if (!isOpen) {
            void logEvent(new UserOpenVaultItemDropdownEvent({
                dropdownType: DropdownType.Copy,
                itemType: vaultItemTypeToHermesItemTypeMap[itemType] ?? ItemType.Credential,
            }));
        }
        setIsOpen(!isOpen);
    };
    const onChildClick: MouseEventHandler = (event) => {
        event.stopPropagation();
        event.preventDefault();
        setIsOpen(false);
    };
    return (<DropdownMenu placement="bottom-end" trigger="persist" passThrough={isDisabled || !isOpen} content={<div ref={ref} onClick={onChildClick}>
            {children}
          </div>} sx={{
            zIndex: 42,
        }}>
        
        <span tabIndex={-1}>
          <IconButtonWithTooltip onClick={toggleDropdown} tooltipMaxWidth={162} passThrough={isOpen} disabled={isDisabled} aria-expanded={isOpen} tooltipContent={isDisabled
            ? translate(I18N_KEYS.NO_INFO)
            : translate(I18N_KEYS.COPY_INFO_TOOLTIP)} icon={<CopyIcon />} {...rest}/>
        </span>
      </DropdownMenu>);
});
Dropdown.displayName = 'Dropdown';
