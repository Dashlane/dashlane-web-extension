import { ReactNode } from "react";
import { DSStyleObject, Logo } from "@dashlane/design-system";
const PAGE_PADDING = 24;
const PAGE_CARD_HEIGHT = 448;
const SX_STYLES: Record<string, DSStyleObject> = {
  ROOT: {
    minHeight: "100vh",
    overflowY: "auto",
    position: "relative",
    backgroundColor: "ds.background.default",
  },
  CARD: {
    backgroundColor: "ds.container.agnostic.neutral.quiet",
    borderRadius: "8px",
    height: `${PAGE_CARD_HEIGHT}px`,
    margin: `${PAGE_PADDING}px`,
    marginBottom: `-${PAGE_CARD_HEIGHT}px`,
  },
  VIEW: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  WRAPPER: {
    padding: `${PAGE_PADDING + 54}px ${PAGE_PADDING + 60}px`,
  },
};
export const SetupLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div sx={SX_STYLES.ROOT}>
      <div sx={SX_STYLES.CARD} />
      <div sx={SX_STYLES.WRAPPER}>
        <header
          sx={{
            marginBottom: "20px",
          }}
        >
          <Logo name="DashlaneLockup" height={40} />
        </header>
        <div sx={SX_STYLES.VIEW}>{children}</div>
      </div>
    </div>
  );
};
