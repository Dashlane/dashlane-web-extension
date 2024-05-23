import { Heading, jsx } from '@dashlane/ui-components';
import * as React from 'react';
import IntelligentTooltipOnOverflow from 'libs/dashlane-style/intelligent-tooltip-on-overflow/';
import { Tabs } from 'libs/dashlane-style/tabs/tabs';
import { Props as TabProps } from 'libs/dashlane-style/tabs/tab';
import styles from './styles.css';
export interface HeaderProps {
    title: React.ReactNode;
    icon: React.ReactNode;
    iconBackgroundColor?: string;
    children?: React.ReactNode;
    titleDescription?: string;
    tabs?: TabProps[];
    titleColor?: string;
}
const TitleHeading = ({ title }: {
    title: React.ReactNode;
}) => (<Heading size="small" as="h2" color="ds.text.neutral.catchy" className={styles.title}>
    <IntelligentTooltipOnOverflow>{title}</IntelligentTooltipOnOverflow>
  </Heading>);
const TitleDescription = ({ titleDescription, }: {
    titleDescription: string;
}) => (<IntelligentTooltipOnOverflow tooltipText={titleDescription} sx={{ color: 'ds.text.neutral.quiet' }} className={styles.titleDescription}>
    {titleDescription}
  </IntelligentTooltipOnOverflow>);
export const PanelHeader = ({ icon, iconBackgroundColor, titleDescription, title, tabs, children, }: HeaderProps) => (<header className={styles.header} sx={{ backgroundColor: 'ds.container.agnostic.neutral.standard' }}>
    <span className={styles.icon} sx={{ backgroundColor: iconBackgroundColor }}>
      {icon}
    </span>
    <div className={styles.column}>
      <span className={styles.headingColumn}>
        {titleDescription && (<TitleDescription titleDescription={titleDescription}/>)}
        <TitleHeading title={title}/>
        {children}
      </span>
      {tabs && (<div className={styles.tabsContainer}>
          <Tabs tabs={tabs}/>
        </div>)}
    </div>
  </header>);
