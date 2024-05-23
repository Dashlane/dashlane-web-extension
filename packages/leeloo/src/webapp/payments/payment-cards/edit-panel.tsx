import React from 'react';
import { equals } from 'ramda';
import { Alert, AlertSeverity, AlertSize } from '@dashlane/ui-components';
import { PageView } from '@dashlane/hermes';
import { PaymentCard, vaultItemsCrudApi, VaultItemType, } from '@dashlane/vault-contracts';
import { useModuleCommands, useModuleQuery } from '@dashlane/framework-react';
import { isSuccess } from '@dashlane/framework-types';
import { useAlert } from 'libs/alert-notifications/use-alert';
import useTranslate from 'libs/i18n/useTranslate';
import { redirect } from 'libs/router';
import { logPageView } from 'libs/logs/logEvent';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import PaymentCardIcon from 'webapp/payment-card-icon';
import { PaymentCardForm, PaymentCardFormFields, validatePaymentCardForm, } from 'webapp/payments/payment-cards/form';
import getBackgroundColor from 'webapp/payment-card-icon/getBackgroundColorForPaymentCard';
import { useAlertDisplayLogic } from '../bank-accounts/useAlertDisplayLogic';
import alertStyles from 'webapp/payments/bank-accounts/alert.css';
import { EditPanel, PanelHeader } from 'webapp/panel';
import { ConfirmDeleteVaultItemDialog } from 'webapp/personal-data/edit/confirm-delete-vault-item-dialog';
import { DeleteTranslations } from 'webapp/personal-data/edit/types';
import { useProtectedItemsUnlocker } from 'webapp/unlock-items';
const I18N_KEYS = {
    DELETE_CONFIRM: 'webapp_payment_edition_delete_confirm',
    DELETE_DISMISS: 'webapp_payment_edition_delete_dismiss',
    DELETE_HEADER: 'webapp_payment_edition_delete_header',
    DELETE_TEXT: 'webapp_payment_edition_delete_text',
    DISMISS: '_common_alert_dismiss_button',
    GENERIC_DELETE: 'webapp_payment_edition_generic_delete_alert',
    GENERIC_ERROR: '_common_generic_error',
    GENERIC_HEADER: 'payments_header_add_payment_card',
    GENERIC_UPDATE: 'webapp_payment_edition_generic_update_alert',
    NAME_DELETE: 'webapp_payment_edition_name_delete_alert',
    NAME_UPDATE: 'webapp_payment_edition_name_update_alert',
};
interface Props {
    match: {
        params: {
            uuid: string;
        };
    };
}
interface ComponentProps {
    item: PaymentCard;
}
const PaymentCardEditPanelComponent = ({ item }: ComponentProps) => {
    const { translate } = useTranslate();
    const { routes } = useRouterGlobalSettingsContext();
    const editAlert = useAlert();
    const copyAlert = useAlertDisplayLogic();
    const { protectedItemsUnlockerShown } = useProtectedItemsUnlocker();
    const { updateVaultItem } = useModuleCommands(vaultItemsCrudApi);
    const [hasDataBeenModified, setHasDataBeenModified] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [errors, setErrors] = React.useState<Set<keyof PaymentCardFormFields>>();
    const [displayConfirmDeleteDialog, setDisplayConfirmDeleteDialog] = React.useState(false);
    const [paymentCardContent, setPaymentCardContent] = React.useState<PaymentCard>(item);
    React.useEffect(() => {
        logPageView(PageView.ItemCreditCardDetails);
    }, []);
    const showGenericError = () => {
        editAlert.showAlert(translate(I18N_KEYS.GENERIC_ERROR), AlertSeverity.ERROR);
    };
    const showCopyAlert = (message: string) => {
        copyAlert.setAlertMessage(message);
        copyAlert.show();
    };
    const dismissCopyAlert = () => {
        copyAlert.hide();
    };
    const showListView = () => {
        logPageView(PageView.ItemPaymentList);
        redirect(routes.userPayments);
    };
    const handleEditForm = (newContent: PaymentCard) => {
        setHasDataBeenModified(!equals(newContent, item));
        setPaymentCardContent(newContent);
    };
    const openConfirmDeleteDialog = () => setDisplayConfirmDeleteDialog(true);
    const closeConfirmDeleteDialog = () => setDisplayConfirmDeleteDialog(false);
    const handleSubmit = async (): Promise<void> => {
        if (isSubmitting) {
            return;
        }
        const validationResult = validatePaymentCardForm(paymentCardContent);
        if (!validationResult.isValid) {
            return setErrors(validationResult.errorSet);
        }
        setIsSubmitting(true);
        try {
            const updateResult = await updateVaultItem({
                vaultItemType: VaultItemType.PaymentCard,
                content: paymentCardContent,
                id: item.id,
            });
            if (isSuccess(updateResult)) {
                const message = paymentCardContent.itemName
                    ? translate(I18N_KEYS.NAME_UPDATE, {
                        paymentCard: paymentCardContent.itemName,
                    })
                    : translate(I18N_KEYS.GENERIC_UPDATE);
                editAlert.showAlert(message, AlertSeverity.SUCCESS);
                showListView();
            }
            else {
                setIsSubmitting(false);
                showGenericError();
            }
        }
        catch (error) {
            setIsSubmitting(false);
            showGenericError();
        }
    };
    const itemTitle = item.itemName || translate(I18N_KEYS.GENERIC_HEADER);
    const confirmDeleteSubtitle = translate(I18N_KEYS.DELETE_TEXT);
    const deleteTranslations: DeleteTranslations = {
        confirmDeleteConfirm: translate(I18N_KEYS.DELETE_CONFIRM),
        confirmDeleteDismiss: translate(I18N_KEYS.DELETE_DISMISS),
        confirmDeleteSubtitle,
        confirmDeleteTitle: translate(I18N_KEYS.DELETE_HEADER),
        deleteSuccessToast: item.itemName
            ? translate(I18N_KEYS.NAME_DELETE, {
                paymentCard: item.itemName,
            })
            : translate(I18N_KEYS.GENERIC_DELETE),
    };
    return (<EditPanel isViewingExistingItem={true} itemHasBeenEdited={hasDataBeenModified} onNavigateOut={showListView} onSubmit={handleSubmit} onClickDelete={openConfirmDeleteDialog} ignoreCloseOnEscape={displayConfirmDeleteDialog || protectedItemsUnlockerShown} formId="edit_paymentcard_panel" header={<PanelHeader icon={<PaymentCardIcon paymentCardColor={paymentCardContent.color} iconSize="large"/>} iconBackgroundColor={getBackgroundColor(paymentCardContent.color)} title={itemTitle}/>}>
      <PaymentCardForm itemId={item.id} errors={errors} paymentCardContent={paymentCardContent} signalEditedValues={handleEditForm} showCopyAlert={showCopyAlert}/>
      <ConfirmDeleteVaultItemDialog isVisible={displayConfirmDeleteDialog} itemId={item.id} closeConfirmDeleteDialog={closeConfirmDeleteDialog} onDeletionSuccess={showListView} translations={deleteTranslations} vaultItemType={VaultItemType.PaymentCard}/>
      {copyAlert.isAlertVisible && (<div className={alertStyles.alertWrapper}>
          <Alert size={AlertSize.SMALL} severity={AlertSeverity.SUCCESS} closeIconName={translate(I18N_KEYS.DISMISS)} onClose={dismissCopyAlert}>
            {copyAlert.alertMessage}
          </Alert>
        </div>)}
    </EditPanel>);
};
export const PaymentCardEditPanel = ({ match }: Props) => {
    const { data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.PaymentCard],
        ids: [`{${match.params.uuid}}`],
    });
    if (!data?.paymentCardsResult.items.length) {
        return null;
    }
    return (<PaymentCardEditPanelComponent item={data.paymentCardsResult.items[0]}/>);
};
