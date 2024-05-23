import React, { useEffect, useState } from 'react';
import { PageView } from '@dashlane/hermes';
import { AlertSeverity } from '@dashlane/ui-components';
import { isSuccess } from '@dashlane/framework-types';
import { useModuleCommands } from '@dashlane/framework-react';
import { PaymentCardColorType, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { useAlert } from 'libs/alert-notifications/use-alert';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'libs/logs/logEvent';
import { redirect } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { useTrialDiscontinuedDialogContext } from 'libs/trial/trialDiscontinuationDialogContext';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { PaymentCardForm, PaymentCardFormFields, validatePaymentCardForm, } from 'webapp/payments/payment-cards/form';
import PaymentCardIcon from 'webapp/payment-card-icon';
import getBackgroundColor from 'webapp/payment-card-icon/getBackgroundColorForPaymentCard';
import { EditPanel, PanelHeader } from 'webapp/panel';
const I18N_KEYS = {
    GENERIC_ERROR: '_common_generic_error',
    GENERIC_SAVE: 'webapp_payment_edition_generic_save_alert',
    NAME_DEFAULT: 'webapp_payment_edition_name_default',
    NAME_SAVE: 'webapp_payment_edition_name_save_alert',
    PAYMENT_CARD: 'webapp_payment_edition_header_add_payment_card',
};
export const PaymentCardAddPanel = () => {
    const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const { showAlert } = useAlert();
    const { createVaultItem } = useModuleCommands(vaultItemsCrudApi);
    const { currentSpaceId } = useTeamSpaceContext();
    const [errors, setErrors] = useState<Set<keyof PaymentCardFormFields>>();
    const [paymentCardContent, setPaymentCardContent] = useState<PaymentCardFormFields>({
        itemName: '',
        cardNumber: '',
        ownerName: '',
        securityCode: '',
        expireMonth: '',
        expireYear: '',
        color: PaymentCardColorType.Blue1,
        spaceId: currentSpaceId ?? '',
        note: '',
    });
    const { openDialog: openTrialDiscontinuedDialog, shouldShowTrialDiscontinuedDialog, } = useTrialDiscontinuedDialogContext();
    useEffect(() => {
        logPageView(PageView.ItemCreditCardCreate);
    }, []);
    useEffect(() => {
        if (shouldShowTrialDiscontinuedDialog) {
            openTrialDiscontinuedDialog();
        }
    }, [shouldShowTrialDiscontinuedDialog]);
    const showListView = () => {
        logPageView(PageView.ItemPaymentList);
        redirect(routes.userPayments);
    };
    const handleEditedForm = (newContent: PaymentCardFormFields) => {
        setPaymentCardContent(newContent);
        setHasDataBeenModified(true);
    };
    const submit = async (): Promise<void> => {
        if (isSubmitting) {
            return;
        }
        const validationResult = validatePaymentCardForm(paymentCardContent);
        if (!validationResult.isValid) {
            return setErrors(validationResult.errorSet);
        }
        setIsSubmitting(true);
        try {
            const createResult = await createVaultItem({
                vaultItemType: VaultItemType.PaymentCard,
                content: paymentCardContent,
            });
            if (isSuccess(createResult)) {
                showAlert(paymentCardContent.itemName
                    ? translate(I18N_KEYS.NAME_SAVE, {
                        paymentCard: paymentCardContent.itemName,
                    })
                    : translate(I18N_KEYS.GENERIC_SAVE), AlertSeverity.SUCCESS);
                showListView();
            }
            else {
                showAlert(translate(I18N_KEYS.GENERIC_ERROR), AlertSeverity.ERROR);
                setIsSubmitting(false);
            }
        }
        catch (_) {
            showAlert(translate(I18N_KEYS.GENERIC_ERROR), AlertSeverity.ERROR);
            setIsSubmitting(false);
        }
    };
    return (<EditPanel isViewingExistingItem={false} itemHasBeenEdited={hasDataBeenModified} onNavigateOut={showListView} submitPending={isSubmitting} onSubmit={submit} formId="add_paymentcard_panel" header={<PanelHeader icon={<PaymentCardIcon iconSize="large"/>} iconBackgroundColor={getBackgroundColor(paymentCardContent.color)} title={translate(I18N_KEYS.PAYMENT_CARD)}/>}>
      <PaymentCardForm paymentCardContent={paymentCardContent} signalEditedValues={handleEditedForm} errors={errors}/>
    </EditPanel>);
};
