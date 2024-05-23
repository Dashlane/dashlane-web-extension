import { ThemeUIStyleObject } from '@dashlane/design-system';
export const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    CONTAINER: {
        maxWidth: '1200px',
        minWidth: '600px',
        margin: '0 auto',
        padding: '0 32px',
    },
    HEADER: {
        width: '100%',
    },
    CONTENT: {
        padding: '48px 32px',
    },
    LINK: {
        color: 'ds.text.brand.standard',
        textDecorationLine: 'none',
        outlineColor: 'ds.text.brand.standard',
    },
};
