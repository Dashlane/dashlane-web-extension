import { colors, jsx, ThemeUIStyleObject } from '@dashlane/ui-components';
import { PropsWithChildren } from 'react';
export const containerStyle: ThemeUIStyleObject = {
    bg: 'white',
    padding: '32px',
    border: `1px solid ${colors.dashGreen05}`,
    borderRadius: 2,
    marginTop: '16px',
};
export const TutorialStepWrapper = ({ children, }: PropsWithChildren<unknown>) => {
    return <div sx={containerStyle}>{children}</div>;
};
