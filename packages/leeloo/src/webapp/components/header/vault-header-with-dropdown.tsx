import { HTMLAttributes, ReactNode, useState } from "react";
import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTriggerButton,
  IconName,
} from "@dashlane/design-system";
import { Header } from "./header";
export interface MenuItems {
  icon?: IconName;
  label: string;
  onClick: () => void;
}
export const HeaderDropdown = ({
  menuItems,
  buttonLabel,
}: {
  menuItems: MenuItems[];
  buttonLabel: string;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <DropdownMenu
      align="start"
      isOpen={isDropdownOpen}
      onOpenChange={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      <DropdownTriggerButton
        aria-label={buttonLabel}
        icon="ActionAddOutlined"
        layout="iconLeading"
      >
        {buttonLabel}
      </DropdownTriggerButton>
      <DropdownContent>
        {menuItems.map((item: MenuItems) => (
          <DropdownItem
            key={item.label}
            label={item.label}
            leadingIcon={item.icon}
            onSelect={() => {
              setIsDropdownOpen(false);
              item.onClick();
            }}
          />
        ))}
      </DropdownContent>
    </DropdownMenu>
  );
};
interface Props extends HTMLAttributes<HTMLDivElement> {
  endWidget: ReactNode;
  dropdown: ReactNode;
}
export const VaultHeaderWithDropdown = ({
  endWidget,
  dropdown,
  ...rest
}: Props) => {
  return (
    <Header
      startWidgets={<div sx={{ position: "relative" }}>{dropdown}</div>}
      endWidget={endWidget}
      {...rest}
    />
  );
};
