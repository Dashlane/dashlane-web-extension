import { ThemeUIStyleObject } from '@dashlane/design-system';
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    HEADER: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
    },
    GAUGE_WRAPPER: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'relative',
    },
    GAUGE_LABELS: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '30px',
    },
    GAUGE_OUT_OF_100: {
        color: 'ds.text.neutral.quiet',
        textTransform: 'lowercase',
        variant: 'ds.body.standard.regular',
    },
    SCORE_LABEL: {
        textTransform: 'uppercase',
        fontSize: '12px',
    },
};
