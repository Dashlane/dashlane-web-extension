import { ThemeUIStyleObject } from "@dashlane/design-system";
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  BANNER: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "13px",
    lineHeight: "18px",
    fontWeight: "400",
    width: "100%",
    height: "34px",
    gap: "4px",
    zIndex: "3",
  },
  FREE_TRIAL_STAGE_TWO: {
    backgroundColor: "ds.container.expressive.brand.catchy.idle",
    color: "ds.text.inverse.catchy",
    "> a": {
      color: "ds.text.inverse.catchy",
    },
  },
  FREE_TRIAL_STAGE_ONE: {
    backgroundColor: "ds.container.expressive.brand.quiet.idle",
    color: "ds.text.brand.standard",
    "> a": {
      color: "ds.text.brand.standard",
    },
  },
  GRACE_PERIOD: {
    backgroundColor: "ds.container.expressive.warning.catchy.idle",
    color: "ds.text.inverse.catchy",
    "> a": {
      color: "ds.text.inverse.catchy",
    },
  },
  DISCONTINUED: {
    backgroundColor: "ds.container.expressive.danger.quiet.idle",
    color: "ds.text.danger.standard",
    "> a": {
      color: "ds.text.danger.standard",
    },
  },
};
