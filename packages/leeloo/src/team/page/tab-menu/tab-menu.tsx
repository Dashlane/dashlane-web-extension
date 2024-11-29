import { ReactNode } from "react";
import { HorizontalNavItem, HorizontalNavMenu } from "@dashlane/ui-components";
import {
  Heading,
  mergeSx,
  Paragraph,
  ThemeUIStyleObject,
} from "@dashlane/design-system";
import { NavLink, useLocation } from "../../../libs/router";
import styles from "./styles.css";
export enum TabId {
  TAB_SCIM,
  TAB_ACTIVE_DIRECTORY,
  TAB_AUTHENTICATION,
}
export interface Tab {
  id?: TabId;
  label: string;
  url: string;
  subPaths?: string[];
  notifications?: number;
  isDisabled?: boolean;
}
export interface Props {
  title?: string;
  titleBadge?: ReactNode;
  subtitle?: ReactNode;
  tabs?: Tab[];
  extraInfo?: JSX.Element;
  hasInfobox?: boolean | null;
}
const isSelectedMatch = (tab: Tab, pathname: string) => {
  const activeMatches = [
    tab.url,
    ...(tab.subPaths ? tab.subPaths.map((v) => `${tab.url}${v}`) : []),
  ];
  return activeMatches.includes(pathname);
};
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  TITLE: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "32px",
  },
  TAB: {
    width: "auto",
    whiteSpace: "nowrap",
    color: "ds.text.neutral.standard !important",
    backgroundColor: "ds.container.expressive.neutral.supershy.idle !important",
    "&:hover, &:active": {
      backgroundColor:
        "ds.container.expressive.neutral.supershy.hover !important",
    },
  },
  DISABLED_TAB: {
    pointerEvents: "none",
    color: "ds.text.oddity.disabled",
  },
  SELECTED_TAB: {
    backgroundColor:
      "ds.container.expressive.neutral.supershy.active !important",
  },
};
export const TabMenu = ({
  title,
  titleBadge,
  subtitle,
  tabs = [],
  extraInfo,
  hasInfobox,
}: Props) => {
  const { pathname } = useLocation();
  if (!title && !tabs.length) {
    return null;
  }
  return (
    <nav className={!hasInfobox ? styles.tabMenuContainer : undefined}>
      {title ? (
        <Heading
          as="h1"
          textStyle="ds.title.section.large"
          color="ds.text.neutral.catchy"
        >
          <span sx={SX_STYLES.TITLE}>
            {title}
            {titleBadge}
          </span>
        </Heading>
      ) : null}
      {subtitle ? (
        <Paragraph
          as="h2"
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.quiet"
          sx={{ marginBottom: "32px", a: { fontWeight: 600 } }}
        >
          {subtitle}
        </Paragraph>
      ) : null}
      {extraInfo ?? null}
      {tabs.length ? (
        <HorizontalNavMenu>
          {tabs.map((tab) => (
            <HorizontalNavItem
              key={tab.label}
              label={tab.label}
              notification={tab.notifications}
              selected={isSelectedMatch(tab, pathname)}
              sx={mergeSx([
                SX_STYLES.TAB,
                tab.isDisabled ? SX_STYLES.DISABLED_TAB : {},
                isSelectedMatch(tab, pathname) ? SX_STYLES.SELECTED_TAB : {},
              ])}
              as={(customProps: Record<string, unknown>) => (
                <NavLink to={tab.url} {...customProps} />
              )}
            />
          ))}
        </HorizontalNavMenu>
      ) : null}
    </nav>
  );
};
