import { defaultTheme as dsTheme, jsx } from "@dashlane/design-system";
import { CloseIcon } from "@dashlane/ui-components";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  CLEAR_SEARCH: "tab/all_items/tab_bar/clear_search",
};
interface Props {
  onClick: () => void;
  isHidden?: boolean;
}
export const SearchCloseIcon = ({ onClick, isHidden = true }: Props) => {
  const { translate } = useTranslate();
  return (
    <button
      onClick={onClick}
      aria-hidden={isHidden}
      sx={{
        right: "0",
        transform: "translateX(-50%)",
        outline: "none",
        cursor: "pointer",
        ...(isHidden && { visibility: "hidden", opacity: "0" }),
        transitionDuration: "250ms",
        transitionProperty: "opacity, visibility",
      }}
      aria-label={translate(I18N_KEYS.CLEAR_SEARCH)}
    >
      <CloseIcon color={dsTheme.colors.ds.text.neutral.quiet} />
    </button>
  );
};
