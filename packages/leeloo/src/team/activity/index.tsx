import { ReactNode } from 'react';
import { jsx, ThemeUIStyleObject } from '@dashlane/design-system';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import useTranslate from 'libs/i18n/useTranslate';
import { Header } from 'team/activity/header/header';
import { ConsolePage } from 'team/page';
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    ACTIVITY_PANEL: {
        display: 'inline-block',
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
        padding: '24px 32px',
        borderRadius: '8px',
        border: '1px solid ds.border.neutral.quiet.idle',
        flex: '1',
    },
};
const I18N_KEYS = {
    TITLE: 'team_activity_header_title',
};
interface Props {
    isLoading: boolean;
    children?: ReactNode;
}
const Activity = ({ isLoading, children }: Props) => {
    const { translate } = useTranslate();
    return (<ConsolePage header={<Header title={translate(I18N_KEYS.TITLE)}/>}>
      {isLoading ? (<LoadingSpinner containerStyle={{ minHeight: 240 }}/>) : (<div sx={SX_STYLES.ACTIVITY_PANEL}>{children}</div>)}
    </ConsolePage>);
};
export default Activity;
