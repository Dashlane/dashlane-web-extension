import { ThemeUIStyleObject } from '@dashlane/design-system';
export const darkWebMonitoringStyles: Record<string, ThemeUIStyleObject> = {
    onboardingContainer: {
        height: '100%',
        width: '100%',
        position: 'relative',
    },
    rootContainer: {
        backgroundColor: 'ds.background.alternate',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px 0px',
        height: '100%',
        width: '100%',
    },
    header: {
        color: 'ds.background.alternate',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'spaceBetween',
        lineHeight: '1.25',
    },
    freeTrialWarning: {
        lineHeight: '20px',
        marginTop: '4px',
        color: 'ds.border.warning.standard.active',
    },
    content: {
        display: 'flex',
        flexFlow: 'row wrap',
        flexGrow: 1,
        overflowY: 'auto',
        padding: '8px 24px',
    },
    breachesContent: {
        display: 'flex',
        flexDirection: 'column',
        margin: '8px',
        width: 'min-content',
        flexGrow: 2,
    },
    emailContent: {
        display: 'flex',
        flexDirection: 'column',
        margin: '8px',
        width: 'min-content',
        flexGrow: 1,
        minHeight: 'min-content',
    },
};
