import { Icon, Paragraph } from "@dashlane/design-system";
import { translate } from "../../../libs/i18n";
import { useSearchContext } from "../../search/search-context";
const I18N_KEYS = {
  SEARCH_PLACEHOLDER: "webapp_sidemenu_search_placeholder",
};
export const SearchMenuItem = () => {
  const { openSearch } = useSearchContext();
  const handleOnClick = () => {
    openSearch();
  };
  return (
    <button
      onClick={handleOnClick}
      data-testid="sidemenu-search-button"
      sx={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        width: "100%",
        padding: "14px",
        marginLeft: "50px",
        backgroundColor: "transparent",
        outlineColor: "ds.oddity.focus",
      }}
    >
      <Paragraph
        color="ds.text.neutral.standard"
        textStyle="ds.body.standard.regular"
      >
        {translate(I18N_KEYS.SEARCH_PLACEHOLDER)}
      </Paragraph>
      <Icon
        name="ActionSearchOutlined"
        size="small"
        color="ds.text.neutral.standard"
      />
    </button>
  );
};
