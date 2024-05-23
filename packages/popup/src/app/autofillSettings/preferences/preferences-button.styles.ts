import { ThemeUIStyleObject } from '@dashlane/design-system';
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    CONTAINER: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '16px 10px',
        marginTop: '16px',
        borderTop: '1px solid',
        borderBottom: '1px solid',
        borderTopColor: 'ds.border.neutral.quiet.idle',
        borderBottomColor: 'ds.border.neutral.quiet.idle',
        color: 'ds.text.neutral.catchy',
        fontSize: '14px',
        lineHeight: '20px',
        '&:hover': {
            outline: 'none',
            cursor: 'pointer',
        },
    },
    CONTENT: {
        display: 'flex',
        flexDirection: 'row',
        gap: '8px',
        alignItems: 'center',
    },
};
