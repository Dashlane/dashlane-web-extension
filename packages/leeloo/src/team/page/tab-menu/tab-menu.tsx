import * as React from 'react';
import { NavLink, useLocation } from 'libs/router';
import { HorizontalNavItem, HorizontalNavMenu } from '@dashlane/ui-components';
import { Heading, jsx, mergeSx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import styles from './styles.css';
export enum TabId {
    TAB_SCIM,
    TAB_ACTIVE_DIRECTORY,
    TAB_AUTHENTICATION
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
    titleBadge?: React.ReactNode;
    subtitle?: React.ReactNode;
    tabs?: Tab[];
    extraInfo?: JSX.Element;
}
const tabStyle: ThemeUIStyleObject = {
    width: 'auto',
    whiteSpace: 'nowrap',
    color: 'ds.text.neutral.standard',
};
const isSelectedMatch = (tab: Tab, pathname: string) => {
    const activeMatches = [
        tab.url,
        ...(tab.subPaths ? tab.subPaths.map((v) => `${tab.url}${v}`) : []),
    ];
    return activeMatches.includes(pathname);
};
const SX_STYLES = {
    TITLE: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '32px',
    },
};
const TabMenuComponent = ({ title, titleBadge, subtitle, tabs = [], extraInfo, }: Props) => {
    const { pathname } = useLocation();
    if (!title && !tabs.length) {
        return null;
    }
    return (<nav className={styles.tabMenuContainer}>
      {title ? (<Heading as="h1" textStyle="ds.title.section.large" color="ds.text.neutral.catchy">
          <span sx={SX_STYLES.TITLE}>
            {title}
            {titleBadge}
          </span>
        </Heading>) : null}
      {subtitle ? (<Paragraph as="h2" textStyle="ds.body.standard.regular" color="ds.text.neutral.quiet" sx={{ marginBottom: '32px', a: { fontWeight: 600 } }}>
          {subtitle}
        </Paragraph>) : null}
      {extraInfo ?? null}
      {tabs.length ? (<HorizontalNavMenu>
          {tabs.map((tab) => (<HorizontalNavItem key={tab.label} label={tab.label} notification={tab.notifications} selected={isSelectedMatch(tab, pathname)} sx={mergeSx([
                    tabStyle,
                    tab.isDisabled
                        ? {
                            pointerEvents: 'none',
                            color: 'ds.text.oddity.disabled',
                        }
                        : {},
                    isSelectedMatch(tab, pathname)
                        ? {
                            backgroundColor: 'ds.container.expressive.neutral.supershy.active',
                        }
                        : {},
                ])} as={(customProps: Record<string, unknown>) => (<NavLink to={tab.url} {...customProps}/>)}/>))}
        </HorizontalNavMenu>) : null}
    </nav>);
};
export const TabMenu = React.memo(TabMenuComponent);
