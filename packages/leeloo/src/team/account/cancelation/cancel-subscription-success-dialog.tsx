import { useEffect } from 'react';
import { Dialog, Icon, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { logPageView } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
const SX_STYLES: Record<string, ThemeUIStyleObject> = {
    ITEM: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: '16px',
    },
    WRAPPER: {
        margin: '16px 0',
        gap: '24px',
        display: 'flex',
        flexDirection: 'column',
    },
};
const I18N_KEYS = {
    CLOSE: 'team_account_cancel_confirmation_dialog_close',
    DIALOG_TITLE: 'team_account_cancel_confirmation_dialog_heading',
    SUBSCRIPTION_ACTIVE_ITEM: 'team_account_cancel_confirmation_dialog_paragraph_1_markup',
    REACTIVATE_SUBSCRIPTION_ITEM: 'team_account_cancel_confirmation_dialog_paragraph_2',
};
interface Props {
    handleClose: () => void;
}
export const CancelSubscriptionConfirmationDialog = ({ handleClose, }: Props) => {
    const { translate } = useTranslate();
    useEffect(() => {
        logPageView(PageView.TacConfirmSubscriptionCancellationRequestSubmission);
    }, []);
    return (<Dialog isOpen={true} onClose={handleClose} title={translate(I18N_KEYS.DIALOG_TITLE)} closeActionLabel={translate(I18N_KEYS.CLOSE)} actions={{
            primary: {
                children: translate(I18N_KEYS.CLOSE),
                onClick: handleClose,
            },
        }}>
      <div sx={SX_STYLES.WRAPPER}>
        <div sx={SX_STYLES.ITEM}>
          <Icon name={'ItemEmailOutlined'} size="xlarge"/>
          <Paragraph>
            {translate.markup(I18N_KEYS.SUBSCRIPTION_ACTIVE_ITEM)}
          </Paragraph>
        </div>

        <div sx={SX_STYLES.ITEM}>
          <Icon name={'ActionUndoOutlined'} size="xlarge"/>
          <Paragraph>
            {translate(I18N_KEYS.REACTIVATE_SUBSCRIPTION_ITEM)}
          </Paragraph>
        </div>
      </div>
    </Dialog>);
};
