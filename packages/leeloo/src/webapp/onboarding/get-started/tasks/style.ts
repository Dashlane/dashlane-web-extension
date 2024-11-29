import { ThemeUIStyleObject } from "@dashlane/design-system";
export const ONBOARDING_TASKS_STYLE: Record<
  string,
  Partial<ThemeUIStyleObject>
> = {
  JUMBOTRON_CONTAINER: {
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid ds.border.neutral.quiet.idle",
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    boxShadow: "0 4px 4px 0 rgba(0, 0, 0, 0.25)",
    display: "flex",
    gap: "15px",
    flexDirection: "row",
    flexWrap: "nowrap",
    "@media screen and (max-width: 1380px)": {
      flexDirection: "column-reverse",
    },
  },
};
