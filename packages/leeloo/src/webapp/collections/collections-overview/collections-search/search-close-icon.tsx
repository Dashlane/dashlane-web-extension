import { Icon } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
interface Props {
  onClick: () => void;
  isHidden: boolean;
}
export const SearchCloseIcon = ({ onClick, isHidden }: Props) => {
  const { translate } = useTranslate();
  return (
    <Icon
      aria-hidden={isHidden}
      title={translate("collections_overview_search_clear_search")}
      name="ActionCloseOutlined"
      onClick={onClick}
      sx={{
        alignSelf: "center",
        cursor: "pointer",
        "&:hover": {
          opacity: isHidden ? "0" : "100%",
        },
        visibility: isHidden ? "hidden" : "visible",
        opacity: isHidden ? "0" : "50%",
        transitionDuration: "200ms",
        transitionProperty: "opacity, visibility",
      }}
    />
  );
};
