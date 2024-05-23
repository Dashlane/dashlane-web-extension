import * as React from 'react';
import { Card, colors, FlexChild, FlexContainer, Heading, mergeSx, ThemeUIStyleObject, } from '@dashlane/ui-components';
export const ChangePlanCard = ({ title, children, sx, }: {
    title?: string | React.ReactNode;
    children?: React.ReactNode;
    sx?: Partial<ThemeUIStyleObject> | undefined;
}) => {
    return (<Card sx={mergeSx([
            {
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                gap: '16px',
                backgroundColor: colors.white,
                borderRadius: '4px',
                border: `1px solid ${colors.dashGreen05}`,
            },
            ...(sx ? [sx] : []),
        ])}>
      <FlexContainer flexDirection="column" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {title ? (typeof title === 'string' ? (<Heading size="small">{title}</Heading>) : (title)) : null}
        <FlexChild flex="1">{children}</FlexChild>
      </FlexContainer>
    </Card>);
};
