import { useContext } from "react";
import { Button, Icon, jsx } from "@dashlane/design-system";
import { I18nContext } from "../../../context/i18n";
import { SX_STYLES } from "./Header.styles";
const I18N_KEYS = {
  CLOSE: "closeWindow",
  ROLE_BUTTON: "roleButton",
};
interface Props {
  isDropdown?: boolean;
  onClose?: () => void;
}
export const HeaderCloseButton = ({ isDropdown, onClose }: Props) => {
  const { translate } = useContext(I18nContext);
  return (
    <Button
      onClick={onClose}
      aria-label={translate(I18N_KEYS.CLOSE)}
      data-testid="header-close-button"
      data-keyboard-accessible={
        isDropdown
          ? `${translate(I18N_KEYS.CLOSE)}: ${translate(I18N_KEYS.ROLE_BUTTON)}`
          : translate(I18N_KEYS.CLOSE)
      }
      mood="neutral"
      intensity="supershy"
      layout="iconOnly"
      icon="ActionCloseOutlined"
      size="small"
    />
  );
};
