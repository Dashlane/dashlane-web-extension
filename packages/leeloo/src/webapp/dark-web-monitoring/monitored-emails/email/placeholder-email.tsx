import { jsx, ThemeUIStyleObject } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { IconStatus } from '../icon-status/icon-status';
const I18N_KEYS = {
    PLACEHOLDER: 'webapp_darkweb_email_placeholder',
};
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    placeholder: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        boxShadow: 'inset 0px -1px 0px ds.border.neutral.quiet.idle',
        padding: '10px 0',
    },
    icon: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: '10px 5px',
        color: 'ds.text.neutral.quiet',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};
export const PlaceholderEmail = () => {
    const { translate } = useTranslate();
    return (<li sx={SX_STYLES.placeholder}>
      <IconStatus />
      <span sx={SX_STYLES.icon}>{translate(I18N_KEYS.PLACEHOLDER)}</span>
    </li>);
};
