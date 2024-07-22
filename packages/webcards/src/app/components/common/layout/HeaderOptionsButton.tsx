import { useContext } from "react";
import { Icon, jsx, mergeSx } from "@dashlane/design-system";
import { I18nContext } from "../../../context/i18n";
import { SX_STYLES } from "./Header.styles";
const I18N_KEYS = {
  CLOSE_OPTIONS: "optionsCloseMenu",
  OPEN_OPTIONS: "optionsOpenMenu",
  ROLE_BUTTON: "roleButton",
};
interface Props {
  autofillOptionsVisible?: boolean;
  onMoreOptions?: () => void;
}
export const HeaderOptionsButton = ({
  autofillOptionsVisible,
  onMoreOptions,
}: Props) => {
  const { translate } = useContext(I18nContext);
  const ariaLabel = autofillOptionsVisible
    ? translate(I18N_KEYS.CLOSE_OPTIONS)
    : translate(I18N_KEYS.OPEN_OPTIONS);
  const optionsSx = autofillOptionsVisible
    ? mergeSx([
        SX_STYLES.DROPDOWN_ACTION,
        { backgroundColor: "ds.container.expressive.neutral.quiet.active" },
      ])
    : SX_STYLES.DROPDOWN_ACTION;
  return (
    <button
      id="dropdownMoreOptions"
      type="button"
      sx={optionsSx}
      onClick={onMoreOptions}
      data-keyboard-accessible={`${ariaLabel}: ${translate(
        I18N_KEYS.ROLE_BUTTON
      )}`}
    >
      <Icon name="ActionMoreOutlined" aria-hidden size="large" />
    </button>
  );
};
