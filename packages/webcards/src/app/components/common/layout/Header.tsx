import { ReactNode, useContext } from "react";
import { Icon, jsx, mergeSx } from "@dashlane/design-system";
import { DismissType } from "@dashlane/hermes";
import Logo from "../../../assets/svg/dashlane_logo.svg";
import { I18nContext } from "../../../context/i18n";
import { HeaderCloseButton } from "./HeaderCloseButton";
import { HeaderOptionsButton } from "./HeaderOptionsButton";
import { SX_STYLES } from "./Header.styles";
const I18N_KEYS = {
  SEARCH_BUTTON: "search",
  ROLE_BUTTON: "roleButton",
};
interface Props {
  children?: ReactNode;
  isDropdown?: boolean;
  isOptionsMenuOpen?: boolean;
  onClickClose?: (dismissType?: DismissType) => void;
  onClickOptions?: () => void;
  onClickSearch?: () => void;
  withDashlaneLogo?: boolean;
}
export const Header = ({
  children,
  withDashlaneLogo,
  isOptionsMenuOpen,
  isDropdown,
  onClickClose,
  onClickOptions,
  onClickSearch,
}: Props) => {
  const { translate } = useContext(I18nContext);
  return (
    <header
      sx={mergeSx([
        SX_STYLES.HEADER,
        isDropdown ? SX_STYLES.DROPDOWN : SX_STYLES.DIALOG,
      ])}
    >
      {withDashlaneLogo ? (
        <Logo
          viewBox={"0 0 10.4 14.9"}
          sx={isDropdown ? SX_STYLES.DROPDOWN_LOGO : SX_STYLES.DIALOG_LOGO}
          aria-hidden
        />
      ) : null}
      <div
        sx={isDropdown ? SX_STYLES.DROPDOWN_CONTENT : SX_STYLES.DIALOG_CONTENT}
      >
        {children}
      </div>
      {isDropdown && onClickSearch ? (
        <button
          id="dropdownSearchButton"
          type="button"
          sx={SX_STYLES.DROPDOWN_ACTION}
          onClick={onClickSearch}
          data-keyboard-accessible={`${translate(I18N_KEYS.SEARCH_BUTTON)}:
            ${translate(I18N_KEYS.ROLE_BUTTON)}`}
        >
          <Icon name="ActionSearchOutlined" size="small" aria-hidden />
        </button>
      ) : null}
      {isDropdown && onClickOptions ? (
        <HeaderOptionsButton
          onMoreOptions={onClickOptions}
          autofillOptionsVisible={isOptionsMenuOpen}
        />
      ) : null}
      {onClickClose ? (
        <HeaderCloseButton
          onClose={() => onClickClose(DismissType.CloseCross)}
          isDropdown={isDropdown}
        />
      ) : null}
    </header>
  );
};
