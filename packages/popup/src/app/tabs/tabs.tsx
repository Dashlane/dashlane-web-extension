import React from 'react';
import { Tab, TabList } from 'react-tabs';
import classNames from 'classnames';
import { Kernel } from 'kernel';
import { getTabConfig, getTabIcon } from 'app/tabs/helpers';
import SelectedIndicator from 'app/tabs/icon/selected-indicator.svg';
import styles from 'app/tabs/styles.css';
interface Props {
    disabledTabs?: number[];
    selectedIndex: number;
    kernel: Kernel;
    isBusinessAdmin: boolean;
    isAdminTabEnabled: boolean;
}
export const AppTabs = ({ kernel, isBusinessAdmin, isAdminTabEnabled, selectedIndex, disabledTabs, }: Props) => {
    const { translate } = kernel.getTranslator();
    const config = getTabConfig(isBusinessAdmin, isAdminTabEnabled);
    const tabs = config.map((tab, i) => {
        const isSelected = selectedIndex === i;
        const isDisabled = Boolean(disabledTabs && disabledTabs.includes(i));
        const icon = getTabIcon({
            isDisabledTab: isDisabled,
            isSelectedTab: isSelected,
            tabConfigItem: tab,
        });
        return (<Tab className={styles.tab} key={`tab-${i}`} disabled={isDisabled} disabledClassName={styles.disabledTab} tabIndex={'0'}>
        <div aria-hidden className={classNames(styles.tabicon)}>
          {icon}
        </div>

        <span className={classNames(styles.tabTitle, {
                [styles.selectedTabTitle]: isSelected,
            })}>
          {translate(tab.titleKey)}
        </span>
        {isSelected && (<div aria-hidden className={styles.selectedTabIndicator}>
            <SelectedIndicator />
          </div>)}
      </Tab>);
    });
    return <TabList className={styles.tabList}>{tabs}</TabList>;
};
