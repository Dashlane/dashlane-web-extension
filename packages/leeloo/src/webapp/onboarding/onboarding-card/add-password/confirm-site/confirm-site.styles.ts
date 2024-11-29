import { ThemeUIStyleObject } from "@dashlane/design-system";
export const CONFIRM_SITE_STYLES: Record<
  string,
  Partial<ThemeUIStyleObject>
> = {
  step: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    "&:last-of-type": {
      marginBottom: 0,
    },
  },
  stepMarkerContainer: {
    borderRadius: "50%",
    backgroundColor: "ds.container.expressive.neutral.quiet.idle",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "32px",
    height: "32px",
    marginRight: "12px",
  },
};
