import { Button, jsx } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
interface Props {
    handleGetPastReceipts: () => void;
}
export const DownloadBillingHistoryButton = ({ handleGetPastReceipts, }: Props) => {
    const { translate } = useTranslate();
    return (<FlexContainer sx={{
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'center',
        }}>
      <Button mood="neutral" intensity="quiet" icon={'DownloadOutlined'} layout="iconLeading" onClick={handleGetPastReceipts} sx={{ width: '100%' }}>
        {translate('team_account_teamplan_plan_download_billing_history')}
      </Button>
    </FlexContainer>);
};
