import * as React from 'react';
import { Tab, Props as TabProps } from './tab';
import { jsx, ThemeUIStyleObject } from '@dashlane/design-system';
export interface Props {
    tabs: TabProps[];
}
const tabsStyle: ThemeUIStyleObject = {
    display: 'flex',
    height: '100%',
    width: '100%',
    gap: '32px',
};
export const Tabs = ({ tabs }: Props) => {
    return (<nav role="navigation">
      <ul sx={tabsStyle} data-testid="details_tabs">
        {tabs.map((t) => (<Tab {...t} tabIconElement={t.tabIconElement} key={t.label}/>))}
      </ul>
    </nav>);
};
