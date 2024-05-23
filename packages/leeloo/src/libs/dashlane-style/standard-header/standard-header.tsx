import { Fragment, MouseEvent, ReactElement, ReactNode } from 'react';
import classnames from 'classnames';
import { Lockup, LockupColor, LockupSize, Logo } from '@dashlane/ui-components';
import { jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { Link } from 'libs/router';
import colorVars from 'libs/dashlane-style/globals/color-variables.css';
import styles from './index.css';
interface BaseTab {
    id: string;
    onClick?: (event: MouseEvent<HTMLElement>) => void;
    text: string;
    url?: string;
}
interface Tab extends BaseTab {
    active?: boolean;
    hasNotification?: boolean;
    items?: BaseTab[];
}
export interface Props {
    children?: ReactNode;
    logoComponent?: ReactElement | null;
    tabs?: Tab[];
    includeLockup?: boolean;
    lockupSize?: LockupSize;
    classes?: {
        standardHeader?: string;
        logoContainer?: string;
        logo?: string;
        tab?: string;
    };
}
const I18N_KEYS = {
    DASHLANE_LOGO_TITLE: '_common_dashlane_logo_title',
};
export const StandardHeader = ({ logoComponent, tabs, includeLockup, lockupSize, classes, children, }: Props) => {
    const { translate } = useTranslate();
    const getTabItem = (tab: Tab) => {
        const baseTabProps = {
            key: tab.id,
            className: classnames(styles.tab, { [styles.tabActive]: tab.active }),
            children: (<>
          {tab.text}
          {tab.items ? <span className={styles.tabArrow}/> : null}
          {tab.hasNotification ? (<span className={styles.notification}/>) : null}
        </>),
            onClick: (event: MouseEvent<HTMLElement>) => {
                if (tab.onClick) {
                    tab.onClick(event);
                }
            },
        };
        return tab.url && !tab.active ? (<Link {...baseTabProps} to={tab.url}/>) : (<span {...baseTabProps}/>);
    };
    const getTab = (tab: Tab) => {
        const tabItem = getTabItem(tab);
        return (<div className={styles.tabContainer} key={tab.id}>
        {tabItem}
        {tab.items ? (<div className={styles.subTabs}>{tab.items.map(getTabItem)}</div>) : null}
      </div>);
    };
    const selectedLogo = includeLockup ? (<Lockup color={LockupColor.White} size={lockupSize || LockupSize.Size64} title={translate(I18N_KEYS.DASHLANE_LOGO_TITLE)}/>) : (<Logo color={colorVars['--white']}/>);
    const LogoComponent = logoComponent ?? <Link to="/" target="self"/>;
    return (<header className={classnames(styles.standardHeader, classes?.standardHeader)}>
      <div className={classnames(styles.logoContainer, classes?.logoContainer)}>
        <LogoComponent.type className={classes?.logo} {...LogoComponent.props}>
          {selectedLogo}
        </LogoComponent.type>
      </div>

      <div className={classnames(styles.tabs, classes?.tab)}>
        {(tabs || []).map(getTab)}
        {children}
      </div>
    </header>);
};
