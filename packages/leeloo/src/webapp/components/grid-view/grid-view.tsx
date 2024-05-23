import { Fragment, memo } from 'react';
import { Heading, jsx } from '@dashlane/design-system';
import { FlexContainer, ThemeUIStyleObject } from '@dashlane/ui-components';
const headerStyles: ThemeUIStyleObject = {
    alignItems: 'center',
    borderBottom: '1px solid transparent',
    borderColor: 'ds.border.neutral.quiet.idle',
    bottom: '12px',
    display: 'flex',
    height: '60px',
    margin: '0 32px',
    userSelect: 'none',
};
const contentStyles: ThemeUIStyleObject = {
    padding: '0 32px 16px 32px',
};
export interface GridViewProps {
    items: unknown[];
    headerTitle: string;
    render: (data: unknown) => React.ReactNode;
}
export const GridViewComponent = ({ headerTitle, items, render, }: GridViewProps) => {
    return (<>
      <Heading as="h2" textStyle="ds.title.supporting.small" color="ds.text.neutral.quiet" sx={headerStyles}>
        {headerTitle}
      </Heading>
      <FlexContainer flexWrap="wrap" justifyContent="start" sx={contentStyles}>
        {items.map(render)}
      </FlexContainer>
    </>);
};
export const GridView = memo(GridViewComponent);
