import { Dispatch, SetStateAction, useEffect } from 'react';
import { Button, Infobox } from '@dashlane/design-system';
import { CallToAction, PageView, UserCallToActionEvent, } from '@dashlane/hermes';
import { Dialog, DialogBody, DialogTitle, FlexContainer, jsx, Paragraph, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { DiscontinuationModalState } from '../dashboard';
interface Props {
    isOpen: boolean;
    planCopy: string;
    setModalState: Dispatch<SetStateAction<DiscontinuationModalState>>;
    handleClose: () => void;
}
export const PurchaseDialog = ({ isOpen, planCopy, setModalState, handleClose, }: Props) => {
    const { translate } = useTranslate();
    useEffect(() => {
        logPageView(PageView.TacAccountTrialEndModal);
    }, []);
    return (<Dialog isOpen={isOpen} ariaDescribedby="dialogContent" closeIconName={translate('_common_dialog_dismiss_button')} onClose={() => {
            logEvent(new UserCallToActionEvent({
                callToActionList: [CallToAction.AllOffers],
                hasChosenNoAction: true,
            }));
            handleClose();
        }}>
      <DialogTitle title={translate('team_dashboard_purchase_dialog_title', {
            plan: planCopy,
        })}/>
      <DialogBody>
        <Paragraph color="ds.text.neutral.standard">
          {translate('team_dashboard_purchase_dialog_paragraph_1')}
        </Paragraph>
        <Paragraph color="ds.text.neutral.standard" sx={{ marginTop: '8px' }}>
          {translate('team_dashboard_purchase_dialog_paragraph_2')}
        </Paragraph>
        <div sx={{ marginTop: '24px' }}>
          <Infobox size="large" mood="warning" title={translate('team_dashboard_purchase_dialog_infobox_copy_1')} description={translate('team_dashboard_purchase_dialog_infobox_copy_2')}/>
        </div>
      </DialogBody>
      <FlexContainer sx={{
            justifyContent: 'flex-end',
        }}>
        <Button mood="brand" onClick={() => {
            logEvent(new UserCallToActionEvent({
                callToActionList: [CallToAction.AllOffers],
                chosenAction: CallToAction.AllOffers,
                hasChosenNoAction: false,
            }));
            setModalState(DiscontinuationModalState.PAYMENT);
        }}>
          {translate('team_account_teamplan_plan_buy_dashlane')}
        </Button>
      </FlexContainer>
    </Dialog>);
};
