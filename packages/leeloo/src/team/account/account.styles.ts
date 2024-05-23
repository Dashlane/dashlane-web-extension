import { ThemeUIStyleObject } from '@dashlane/design-system';
export const SX_ACCOUNT_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    CARD_BORDER: {
        border: '1px solid ds.border.neutral.quiet.idle',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    ACCOUNT_PAGE: {
        backgroundColor: 'ds.background.alternate',
        minHeight: '100%',
        '& > div': {
            maxWidth: '74em',
            padding: '32px 48px',
        },
    },
};
