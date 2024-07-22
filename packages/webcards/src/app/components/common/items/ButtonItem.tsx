import { VaultSourceType } from "@dashlane/autofill-contracts";
import { Icon, jsx, mergeSx } from "@dashlane/design-system";
import { KEYBOARD_EVENTS } from "../../../constants";
import { getIconName } from "../icons/icons";
import { SX_STYLES } from "./Items.styles";
interface Props {
  value: string;
  itemIndex?: number;
  onClick: () => void;
  icon?: VaultSourceType;
}
export const ButtonItem = ({ onClick, icon, value }: Props) => {
  const iconName = icon ? getIconName(icon) : null;
  return (
    <div>
      <hr sx={SX_STYLES.DIVIDER} />
      <div
        sx={mergeSx([SX_STYLES.ITEM_BUTTON, SX_STYLES.ITEM])}
        key="todo"
        onClick={onClick}
        onKeyUp={(e) => {
          if (
            e.key !== KEYBOARD_EVENTS.ENTER &&
            e.key !== KEYBOARD_EVENTS.SPACE
          ) {
            return;
          }
          onClick();
        }}
        role="button"
        tabIndex={0}
        data-keyboard-accessible={value}
      >
        {iconName ? (
          <div
            sx={mergeSx([
              SX_STYLES.ICON_CONTAINER,
              SX_STYLES.SIMPLE_ICON_BACKGROUND,
            ])}
          >
            <Icon name={iconName} size="large" />
          </div>
        ) : null}
        <div sx={SX_STYLES.CONTENT}>
          <div sx={SX_STYLES.TITLE}>{value}</div>
        </div>
      </div>
    </div>
  );
};
