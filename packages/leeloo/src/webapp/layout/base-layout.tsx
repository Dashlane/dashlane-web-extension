import { PropsWithChildren, ReactNode } from "react";
import { Card, DSStyleObject } from "@dashlane/design-system";
const OFFSETS: Record<string, number> = {
  HEADER: 72,
};
export interface BaseLayoutProps {
  children: ReactNode;
  aside?: ReactNode;
  header?: ReactNode;
  withCards?: boolean;
}
export const BaseLayout = ({
  children,
  header,
  aside,
  withCards = true,
}: PropsWithChildren<BaseLayoutProps>) => {
  const WrappingComponent = withCards ? Card : "div";
  const STYLES: Record<string, Partial<DSStyleObject>> = {
    ROOT: {
      height: "100%",
      padding: "0 24px 24px 24px",
      backgroundColor: "ds.background.alternate",
      ...(header ? {} : { paddingTop: "24px" }),
    },
    VIEW: {
      height: header ? `calc(100% - ${OFFSETS.HEADER}px)` : "100%",
      display: "flex",
      flexDirection: "row",
      ...(aside
        ? {
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "1fr 320px",
          }
        : {}),
    },
    CARD_MAIN: {
      width: "100%",
      height: `100%`,
      overflowY: "auto",
    },
    CARD_ASIDE: {
      width: "100%",
      display: "block",
    },
  };
  return (
    <div sx={STYLES.ROOT}>
      {header ? header : null}

      <div sx={STYLES.VIEW}>
        <WrappingComponent sx={STYLES.CARD_MAIN}>{children}</WrappingComponent>

        {aside ? (
          <div>
            <WrappingComponent sx={STYLES.CARD_ASIDE}>
              {aside}
            </WrappingComponent>
          </div>
        ) : null}
      </div>
    </div>
  );
};
