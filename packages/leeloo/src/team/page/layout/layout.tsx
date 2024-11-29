import React from "react";
import { ThemeUIStyleObject } from "@dashlane/design-system";
const SX_STYLES: Record<string, ThemeUIStyleObject> = {
  LAYOUT_CONTAINER: {
    display: "flex",
    flexDirection: "column",
    overflowY: "hidden",
  },
  MAIN_AREA: {
    display: "flex",
    backgroundColor: "ds.background.alternate",
    height: " 100vh",
    position: "relative",
    overflowY: "hidden",
    width: "100vw",
  },
  CONTENT: {
    width: "100%",
    overflowY: "auto",
  },
  SIDE_NAV: {
    backgroundColor: "ds.container.agnostic.inverse.standard",
    nav: { backgroundColor: "ds.container.agnostic.inverse.standard" },
  },
};
export interface LayoutProps {
  brand: React.ReactNode;
  header: React.ReactNode;
  sideNav: React.ReactNode;
  bottomButton: React.ReactNode;
  banner?: React.ReactNode;
  dialog?: React.ReactNode;
}
export const Layout = (props: React.PropsWithChildren<LayoutProps>) => {
  const { brand, children, header, sideNav, banner, dialog, bottomButton } =
    props;
  return (
    <div sx={SX_STYLES.LAYOUT_CONTAINER}>
      <div sx={SX_STYLES.MAIN_AREA}>
        <div sx={SX_STYLES.SIDE_NAV}>
          <div>{brand}</div>
          <div
            style={{
              height: "calc(100% - 160px)",
              overflow: "auto",
            }}
          >
            {sideNav}
          </div>
          <div style={{ height: "80px" }}>{bottomButton}</div>
        </div>

        <div sx={SX_STYLES.CONTENT}>
          {banner ? <div>{banner}</div> : null}
          <div>{header}</div>
          <main>{children}</main>
        </div>
        {dialog ? <div>{dialog} </div> : null}
      </div>
    </div>
  );
};
