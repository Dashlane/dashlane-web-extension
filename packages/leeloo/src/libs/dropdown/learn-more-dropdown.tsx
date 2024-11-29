import {
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownTriggerButton,
} from "@dashlane/design-system";
import { openUrl } from "../external-urls";
interface Props {
  dropdownItems: Record<
    string,
    {
      label: string;
      url: string;
    }
  >;
  title: string;
}
export const LearnMoreDropdown = ({ dropdownItems, title }: Props) => {
  return (
    <DropdownMenu>
      <DropdownTriggerButton
        mood="brand"
        intensity="supershy"
        icon="CaretDownOutlined"
        layout="iconTrailing"
      >
        {title}
      </DropdownTriggerButton>

      <DropdownContent>
        {Object.keys(dropdownItems).map((item) => (
          <DropdownItem
            key={dropdownItems[item].label}
            onSelect={() => openUrl(dropdownItems[item].url)}
            label={dropdownItems[item].label}
            leadingIcon="ActionOpenExternalLinkOutlined"
          />
        ))}
      </DropdownContent>
    </DropdownMenu>
  );
};
