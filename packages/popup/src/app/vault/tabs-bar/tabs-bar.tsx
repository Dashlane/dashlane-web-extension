import { FocusEvent, forwardRef, Ref, useImperativeHandle, useRef, useState, } from 'react';
import { colors, FlexContainer, HorizontalNavButton, HorizontalNavMenu, jsx, ThemeUIStyleObject, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { isElementInViewport } from 'libs/isElementInViewport';
import { TabList, TabName } from './tabs-data';
import { LeftChevron } from './left-chevron';
import { RightChevron } from './right-chevron';
import { scrollViewportToNextChild } from './scroll-helpers';
import { useActiveTabInfoContext } from './active-tab-info-context';
const I18N_KEYS = {
    PREVIOUS: 'tab/all_items/tab_bar/previous',
    NEXT: 'tab/all_items/tab_bar/next',
};
const DEFAULT_CHEVRON_WIDTH = '29px';
const SX_STYLES: {
    [key: string]: ThemeUIStyleObject;
} = {
    TabBarStyle: {
        minHeight: '56px',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
        '::-webkit-scrollbar': {
            width: 0,
            height: 0,
        },
        padding: '0 4px',
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        margin: '0 12px',
    },
    ButtonStyle: {
        whiteSpace: 'nowrap',
        textTransform: 'none',
        '&:hover, &:focus': {
            backgroundColor: colors.dashGreen05,
        },
        '&:focus': {
            outlineOffset: '3px',
        },
    },
    ButtonSelectedStyle: {
        backgroundColor: colors.midGreen05,
        fontWeight: 'light',
    },
    ChevronStyle: {
        width: DEFAULT_CHEVRON_WIDTH,
        cursor: 'pointer',
        ':hover': {
            background: colors.dashGreen05,
            color: colors.midGreen00,
        },
    },
};
type Props = {};
export interface TabsBarHandle {
    focus: () => void;
}
const TabsBarComponent = (_props: Props, ref: Ref<TabsBarHandle>) => {
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(true);
    const { activeTabInfo, setActiveTabInfo } = useActiveTabInfoContext();
    const { translate } = useTranslate();
    const tabsListRef = useRef<HTMLUListElement>(null);
    const credentialsTabRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => ({
        focus: () => {
            credentialsTabRef.current?.focus();
        },
    }));
    const updateNavButtonsVisibility = () => {
        if (tabsListRef.current) {
            const childList = [...tabsListRef.current.children];
            setShowLeftButton(!isElementInViewport(childList[0]));
            setShowRightButton(!isElementInViewport(childList[childList.length - 1]));
        }
    };
    const scrollToNextTab = (direction: 'right' | 'left') => {
        if (tabsListRef.current) {
            scrollViewportToNextChild(tabsListRef.current, direction);
        }
    };
    const handleTabFocus = (event: FocusEvent<HTMLElement>) => {
        event.target.scrollIntoView();
    };
    return (<FlexContainer data-testid="popup_tabs_bar" onScroll={updateNavButtonsVisibility}>
      {showLeftButton ? (<button type="button" onClick={scrollToNextTab.bind(null, 'left')} sx={SX_STYLES.ChevronStyle} title={translate(I18N_KEYS.PREVIOUS)}>
          <LeftChevron />
        </button>) : null}
      <HorizontalNavMenu sx={SX_STYLES.TabBarStyle} ref={tabsListRef}>
        {TabList.map((tabInfo) => (<HorizontalNavButton key={tabInfo.nameKey} label={translate(tabInfo.nameKey)} size="small" onClick={() => setActiveTabInfo(tabInfo)} onFocus={handleTabFocus} sx={{
                ...SX_STYLES.ButtonStyle,
                ...(activeTabInfo.name === tabInfo.name
                    ? SX_STYLES.ButtonSelectedStyle
                    : {}),
            }} selected={activeTabInfo
                ? activeTabInfo.name === tabInfo.name
                : tabInfo.name === TabName.Passwords}/>))}
      </HorizontalNavMenu>
      {showRightButton ? (<button type="button" onClick={scrollToNextTab.bind(null, 'right')} sx={SX_STYLES.ChevronStyle} title={translate(I18N_KEYS.NEXT)}>
          <RightChevron />
        </button>) : null}
    </FlexContainer>);
};
export const TabsBar = forwardRef<TabsBarHandle, Props>(TabsBarComponent);
