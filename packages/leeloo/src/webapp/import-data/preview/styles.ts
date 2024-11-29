import { ThemeUIStyleObject } from "@dashlane/ui-components";
export const CELL_WIDTH = 300;
export const HEADER_HEIGHT = 50;
const BORDER_WIDTH = 1;
export const CELL_HEIGHT = 75;
export const ROW_HEIGHT = 75;
export const tableCellStyles: ThemeUIStyleObject = {
  verticalAlign: "middle",
  textAlign: "left",
  backgroundClip: "padding-box",
  borderBottomWidth: `${BORDER_WIDTH}px`,
  borderBottomStyle: "solid",
  borderBottomColor: "ds.border.neutral.quiet.idle",
  minWidth: CELL_WIDTH,
  maxWidth: CELL_WIDTH,
  maxHeight: CELL_HEIGHT,
  height: CELL_HEIGHT,
  minHeight: CELL_HEIGHT,
};
export const innerTableCellStyles: ThemeUIStyleObject = {
  color: "ds.text.neutral.quiet",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
  padding: "12px",
  maxHeight: CELL_HEIGHT,
  "&:hover": {
    whiteSpace: "break-spaces",
    overflow: "auto",
  },
};
export const headerCellStyles: ThemeUIStyleObject = {
  ...tableCellStyles,
  paddingY: 0,
  paddingX: "24px",
  position: "sticky",
  top: 0,
  backgroundColor: "ds.container.agnostic.neutral.standard",
  height: `${HEADER_HEIGHT}px`,
  zIndex: "2",
};
export const tableRowStyles = {
  maxHeight: ROW_HEIGHT,
  height: ROW_HEIGHT,
  minHeight: ROW_HEIGHT,
};
