import { Heading, jsx, mergeSx, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import useTranslate from 'libs/i18n/useTranslate';
interface SharingNotificationsEmptyProps {
    isLoading: boolean;
    fullPage: boolean;
}
const I18N_KEYS = {
    EMPTY_STATE_TEXT: 'webapp_sharing_notifications_empty_state_text',
    HEADER: 'webapp_sharing_notifications_header',
};
const fullPageWrapperSx: ThemeUIStyleObject = {
    height: '100vh',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    display: 'flex',
    flexDirection: 'column',
};
const emptyStateSx: ThemeUIStyleObject = {
    padding: '32px',
};
const emptyStateFullPageSx: ThemeUIStyleObject = {
    textAlign: 'center',
    flexDirection: 'column',
    alignItems: 'center',
};
const textFullPageSx: ThemeUIStyleObject = {
    maxWidth: '500px',
    color: 'ds.text.neutral.standard',
};
export const SharingNotificationsEmpty = ({ isLoading, fullPage, }: SharingNotificationsEmptyProps) => {
    const { translate } = useTranslate();
    return (<div sx={fullPage ? fullPageWrapperSx : undefined}>
      <div sx={fullPage
            ? mergeSx([emptyStateSx, emptyStateFullPageSx])
            : emptyStateSx}>
        <Heading size="small" color="black" sx={{ marginBottom: 4, fontWeight: 'bold' }}>
          {translate(I18N_KEYS.HEADER)}
        </Heading>
        {isLoading && fullPage ? (<LoadingSpinner size={50}/>) : (<Paragraph sx={fullPage ? textFullPageSx : undefined}>
            {translate(I18N_KEYS.EMPTY_STATE_TEXT)}
          </Paragraph>)}
      </div>
    </div>);
};
