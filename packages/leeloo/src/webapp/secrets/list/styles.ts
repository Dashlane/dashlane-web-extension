import cssVariables from "../../variables.css";
export const SX_STYLES = {
  CATEGORY_CELL: {
    width: "150px",
    display: "flex",
  },
  CREATED_CELL: {
    width: "204px",
    display: "flex",
  },
  LIST: {
    height: `calc(100vh - ${cssVariables["--dashlane-credentials-header-height"]} - ${cssVariables["--dashlane-credentials-table-header-height"]})`,
  },
  ICON: {
    marginLeft: "5px",
  },
};
