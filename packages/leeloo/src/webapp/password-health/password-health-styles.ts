import { DSStyleObject } from "@dashlane/design-system";
const SIZE_VARIABLES = {
  fontSizWebappBigger: "32px",
  genericPadding: "32px",
  rootHeaderLineHeight: "1.25",
  scoreContainerHeight: "276px",
  zIndexContentOverlap: 2,
  zIndexPWHHeader: 2,
  zIndexPWHListHeader: 1,
};
const ROOT_HEADER_HEIGHT =
  parseFloat(SIZE_VARIABLES.genericPadding) +
  parseFloat(SIZE_VARIABLES.fontSizWebappBigger) *
    parseFloat(SIZE_VARIABLES.rootHeaderLineHeight);
export const passwordHealthStyles: Record<string, Partial<DSStyleObject>> = {
  rootContainer: {
    height: "100%",
    backgroundColor: "ds.background.alternate",
  },
  headerContainer: {
    top: 0,
    width: "100%",
    backgroundColor: "ds.background.alternate",
    position: "absolute",
    paddingLeft: "24px",
    paddingRight: "24px",
    zIndex: SIZE_VARIABLES.zIndexPWHHeader,
  },
  listHeaderContainer: {},
  listHeader: {
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    top: 0,
    zIndex: SIZE_VARIABLES.zIndexPWHListHeader,
    borderColor: "ds.border.neutral.quiet.idle",
    borderStyle: "solid",
    padding: `${SIZE_VARIABLES.genericPadding} ${SIZE_VARIABLES.genericPadding} 20px`,
    borderWidth: "1px 1px 0",
    borderRadius: " 4px 4px 0 0",
  },
  listContainer: {
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    borderColor: "ds.border.neutral.quiet.idle",
    borderStyle: "solid",
    borderWidth: "0 1px 0",
    padding: `0 ${SIZE_VARIABLES.genericPadding} ${SIZE_VARIABLES.genericPadding}`,
  },
  listStyle: {
    width: "100%",
    isolation: "isolate",
  },
  passwordHealthGrid: {
    gridTemplateRows: `${SIZE_VARIABLES.scoreContainerHeight} 1fr`,
    overflow: "auto",
    height: "100%",
    padding: `0 24px`,
    marginTop: ROOT_HEADER_HEIGHT,
    maxHeight: `calc(100% - ${ROOT_HEADER_HEIGHT}px)`,
    flexDirection: "column",
  },
  passwordHealthZoomed: {
    display: "flex",
  },
  passwordHealthScore: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "16px",
  },
  passwordHealthTips: {
    width: "448px",
    marginLeft: "16px",
    marginBottom: "16px",
  },
  passwordHealthTipsZoomed: {
    flexDirection: "column",
    marginBottom: "16px",
  },
};
