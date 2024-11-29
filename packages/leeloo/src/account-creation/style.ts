import { DSStyleObject } from "@dashlane/design-system";
export const ACCOUNT_CREATION_STYLE: Record<string, Partial<DSStyleObject>> = {
  MAIN_CONTAINER: {
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    minHeight: "100vh",
    minWidth: "1010px",
    display: "flex",
  },
  ACCOUNT_CREATION_FORM_CONTAINER: {
    minHeight: "100vh",
    transition: "all 0.5s ease",
    transitionProperty: "min-width, width",
    minWidth: "848px",
    width: "848px",
    "@media (max-width: 1024px)": {
      minWidth: "568px",
      width: "568px",
    },
    "@media (max-width: 1280px) ": {
      minWidth: "688px",
      width: "688px",
    },
  },
};
