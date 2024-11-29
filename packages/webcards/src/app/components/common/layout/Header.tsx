import { ReactNode, useContext } from "react";
import { Button, Countdown, jsx, Logo, mergeSx } from "@dashlane/design-system";
import { DismissType } from "@dashlane/hermes";
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
  countdownPercentage?: number;
}
export const Header = ({
  children,
  withDashlaneLogo,
  isOptionsMenuOpen,
  isDropdown,
  countdownPercentage,
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
          sx={{ margin: "8px" }}
          height={16}
          name="DashlaneMicroLogomark"
          aria-hidden
        />
      ) : null}
      <div
        sx={isDropdown ? SX_STYLES.DROPDOWN_CONTENT : SX_STYLES.DIALOG_CONTENT}
      >
        {children}
      </div>
      {isDropdown && onClickSearch ? (
        <Button
          onClick={onClickSearch}
          id="dropdownSearchButton"
          data-testid="dropdownSearchButton"
          mood="neutral"
          intensity="supershy"
          layout="iconOnly"
          icon="ActionSearchOutlined"
          size="small"
          data-keyboard-accessible={`${translate(I18N_KEYS.SEARCH_BUTTON)}:
${translate(I18N_KEYS.ROLE_BUTTON)}`}
        />
      ) : null}
      {isDropdown && onClickOptions ? (
        <HeaderOptionsButton
          onMoreOptions={onClickOptions}
          autofillOptionsVisible={isOptionsMenuOpen}
        />
      ) : null}
      {!isDropdown && countdownPercentage ? (
        <div sx={{ marginTop: "6px" }}>
          <Countdown percentage={countdownPercentage} />
        </div>
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
