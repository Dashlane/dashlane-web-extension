import { KeyboardEvent, ReactNode } from 'react';
import { jsx, mergeSx, ThemeUIStyleObject } from '@dashlane/design-system';
interface Props {
    colors: Partial<ThemeUIStyleObject>;
    labelText?: ReactNode | string;
    buttonText?: string;
    handleClick: () => void;
}
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    CONTAINER: {
        marginTop: 'auto',
        display: 'flex',
        padding: '8px 26px',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'ds.text.inverse.catchy',
        fontSize: '13px',
        fontFamily: 'Public Sans',
        lineHeight: '18px',
    },
    STATUS: {
        strong: {
            fontWeight: 'bold',
        },
    },
    CTA: {
        textDecoration: 'underline',
        textUnderlineOffset: '1.5px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
    },
};
export const FooterAlertButton = ({ colors, labelText, buttonText, handleClick, }: Props) => {
    const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleClick();
        }
    };
    return (<button role="link" tabIndex={0} onClick={handleClick} onKeyDown={handleKeyPress} sx={mergeSx([SX_STYLES.CONTAINER, colors])}>
      <span sx={SX_STYLES.STATUS}>{labelText}</span>
      <span>&nbsp;</span>
      <span sx={SX_STYLES.CTA}>{buttonText}</span>
    </button>);
};
