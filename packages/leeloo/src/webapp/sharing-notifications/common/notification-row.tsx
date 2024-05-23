import { jsx } from '@dashlane/design-system';
import { FlexContainer, Paragraph, ThemeUIStyleObject, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { isNotificationDisabled, NotificationStatus, SharingNotification, } from '../types';
const I18N_KEYS = {
    CONFIRM_REFUSE_TEXT: 'webapp_sharing_notifications_confirm_refuse_text',
};
interface NotificationRowProps {
    icon: JSX.Element;
    actions: JSX.Element | null;
    name: string;
    sharedBy: string;
    notification: SharingNotification;
}
export const NotificationRow = (props: NotificationRowProps) => {
    const { notification, actions, icon, name, sharedBy } = props;
    const { translate } = useTranslate();
    const { status } = notification;
    const disabled = isNotificationDisabled(notification);
    const baseRowStyles: ThemeUIStyleObject = {
        padding: '0 32px',
        transition: 'background-color 400ms ease-out, height 150ms ease-out',
        height: 'auto',
        ':not(:last-child) > *': {
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
            borderBottomColor: 'ds.border.neutral.quiet.idle',
        },
    };
    const rowStyles = baseRowStyles;
    const textStyles: ThemeUIStyleObject = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordBreak: 'break-all',
        opacity: disabled ? 0.5 : 1,
    };
    return (<FlexContainer alignItems="center" sx={rowStyles} as="li">
      <FlexContainer alignItems="center" justifyContent="space-between" sx={{
            overflow: 'hidden',
            position: 'relative',
            height: '56px',
            flex: '1',
            flexWrap: 'nowrap',
        }}>
        <FlexContainer alignItems="center" justifyContent="flex-start" flexWrap="nowrap" sx={{ minWidth: '0' }}>
          {icon}
          {status === NotificationStatus.ConfirmRefusal ? (<Paragraph size="x-small" sx={{ marginLeft: '14px', minWidth: 0 }}>
              {translate(I18N_KEYS.CONFIRM_REFUSE_TEXT)}
            </Paragraph>) : (<div sx={{ marginLeft: '14px', minWidth: 0 }}>
              <Paragraph size="medium" color="black" bold as="div" sx={textStyles}>
                {name}
              </Paragraph>
              <Paragraph size="x-small" color="ds.text.neutral.quiet" as="div" sx={textStyles}>
                {sharedBy}
              </Paragraph>
            </div>)}
        </FlexContainer>
        <div sx={{ marginRight: '5px' }}>{actions}</div>
      </FlexContainer>
    </FlexContainer>);
};
