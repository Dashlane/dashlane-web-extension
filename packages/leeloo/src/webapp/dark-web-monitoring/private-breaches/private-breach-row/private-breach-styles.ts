import { ThemeUIStyleObject } from "@dashlane/ui-components";
export const SX_STYLES: Record<string, ThemeUIStyleObject> = {
  privateBreachActions: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    marginRight: "12px",
    gap: "4px",
  },
  privateBreachRow: {
    width: "100%",
    listStyle: "none",
    "&:hover > div > div:last-child": {
      "& > div:first-of-type": {
        display: "block",
      },
      "& > div:last-of-type": {
        display: "none",
      },
    },
  },
  privateBreachContent: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    padding: "10px 0",
    borderBottom: "1px solid ds.border.neutral.quiet.idle",
  },
  privateBreachInfo: {
    alignItems: "center",
    display: "flex",
    overflow: "hidden",
  },
  privateBreachTextInfo: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    overflow: "hidden",
  },
  privateBreachTitle: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    gap: "4px",
  },
  privateBreachEmail: { overflow: "hidden", textOverflow: "ellipsis" },
  privateBreachStatus: {
    display: "flex",
    alignItems: "center",
    width: "200px",
    margin: "0 28px 0 5px",
    height: "40px",
    flexShrink: 0,
  },
  privateBreachDynamicHoverContent: {
    display: "flex",
    justifyContent: "flex-end",
    width: "250px",
  },
};
