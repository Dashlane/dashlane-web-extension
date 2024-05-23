import { Button, Heading, jsx, Paragraph } from '@dashlane/design-system';
import { CancellationStatus } from '@dashlane/team-admin-contracts';
import { TranslateFunction } from 'libs/i18n/types';
import useTranslate from 'libs/i18n/useTranslate';
import { FooterCard } from '../billing/footer-card';
const I18N_KEYS = {
    CANCEL_SUBSCRIPTION_CONTENT: 'team_account_cancel_widget_unsolicited_content_markup',
    CANCEL_SUBSCRIPTION_BUTTON: 'team_account_cancel_widget_unsolicited_button',
    CANCELATION_PENDING_HEADING: 'team_account_cancel_widget_requested_pending_heading',
    CANCELATION_PENDING_CONTENT: 'team_account_cancel_widget_requested_pending_content_markup',
    REACTIVATE_SUBSCRIPTION_HEADING: 'team_account_cancel_widget_requested_complete_heading',
    REACTIVATE_SUBSCRIPTION_CONTENT: 'team_account_cancel_widget_requested_complete_content',
    REACTIVATE_SUBSCRIPTION_BUTTON: 'team_account_cancel_widget_requested_complete_button',
};
interface CancelSubscriptionProps {
    status: CancellationStatus;
    handleClickButton: () => void;
}
type KeyType = 'heading' | 'paragraph' | 'button';
type KeyMap = Record<CancellationStatus, Partial<Record<KeyType, string>>>;
const copy: KeyMap = {
    none: {
        paragraph: I18N_KEYS.CANCEL_SUBSCRIPTION_CONTENT,
        button: I18N_KEYS.CANCEL_SUBSCRIPTION_BUTTON,
    },
    pending: {
        heading: I18N_KEYS.CANCELATION_PENDING_HEADING,
        paragraph: I18N_KEYS.CANCELATION_PENDING_CONTENT,
    },
    canceled: {
        heading: I18N_KEYS.REACTIVATE_SUBSCRIPTION_HEADING,
        paragraph: I18N_KEYS.REACTIVATE_SUBSCRIPTION_CONTENT,
        button: I18N_KEYS.REACTIVATE_SUBSCRIPTION_BUTTON,
    },
};
const getKey = (status: CancellationStatus, keyType: KeyType, translate: TranslateFunction) => {
    switch (status) {
        case CancellationStatus.None:
            return keyType === 'paragraph'
                ? translate.markup(copy.none[keyType] ?? '', {}, { linkTarget: '_blank' })
                : translate(copy.none[keyType] ?? '');
        case CancellationStatus.Pending:
            return keyType === 'paragraph'
                ? translate.markup(copy.pending[keyType] ?? '', {}, { linkTarget: '_blank' })
                : translate(copy.pending[keyType] ?? '');
        case CancellationStatus.Canceled:
            return translate(copy.canceled[keyType] ?? '');
    }
};
export const CancelSubscription = ({ status, handleClickButton, }: CancelSubscriptionProps) => {
    const { translate } = useTranslate();
    return (<FooterCard>
      {status !== CancellationStatus.None ? (<Heading as="h2" color="ds.text.neutral.catchy" textStyle="ds.title.block.medium" sx={{
                marginBottom: '16px',
            }}>
          {getKey(status, 'heading', translate)}
        </Heading>) : null}
      <Paragraph color="ds.text.neutral.quiet" sx={{ fontSize: '15px' }}>
        {getKey(status, 'paragraph', translate)}
      </Paragraph>
      {status !== CancellationStatus.Pending ? (<Button intensity="quiet" mood="neutral" sx={{ marginTop: '16px' }} onClick={handleClickButton}>
          {getKey(status, 'button', translate)}
        </Button>) : null}
    </FooterCard>);
};
