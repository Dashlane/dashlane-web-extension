import { useCallback, useEffect, useState } from "react";
import { equals } from "ramda";
import { isSuccess } from "@dashlane/framework-types";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  BankAccount,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import {
  Alert,
  AlertSeverity,
  AlertSize,
  colors,
} from "@dashlane/ui-components";
import { PageView } from "@dashlane/hermes";
import { useAlert } from "../../../../libs/alert-notifications/use-alert";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../libs/logs/logEvent";
import { redirect } from "../../../../libs/router";
import { useRouterGlobalSettingsContext } from "../../../../libs/router/RouterGlobalSettingsProvider";
import { EditPanel, PanelHeader } from "../../../panel";
import { ConfirmDeleteVaultItemDialog } from "../../../personal-data/edit/confirm-delete-vault-item-dialog";
import { BankAccountIcon } from "../icons/bank-account-icon";
import {
  BankAccountForm,
  BankAccountFormFields,
  validateBankAccountForm,
} from "../form";
import { useAlertDisplayLogic } from "../useAlertDisplayLogic";
import { useProtectedItemsUnlocker } from "../../../unlock-items/useProtectedItemsUnlocker";
import alertStyles from "../alert.css";
const I18N_KEYS = {
  DELETE_CONFIRM: "webapp_payment_edition_bank_account_delete_confirm",
  DELETE_DISMISS: "webapp_payment_edition_bank_account_delete_dismiss",
  DELETE_SUBTITLE: "webapp_payment_edition_bank_account_delete_subtitle",
  DELETE_TITLE: "webapp_payment_edition_bank_account_delete_title",
  DISMISS: "_common_alert_dismiss_button",
  GENERIC_DELETE: "webapp_payment_edition_bank_account_generic_delete_alert",
  GENERIC_ERROR: "_common_generic_error",
  GENERIC_UPDATE: "webapp_payment_edition_bank_account_generic_update_alert",
  NAME_DELETE: "webapp_payment_edition_bank_account_name_delete_alert",
  NAME_UPDATE: "webapp_payment_edition_bank_account_name_update_alert",
};
const FORM_ID = "bank-account-edit-form";
interface BankAccountEditViewProps {
  item: BankAccount;
}
export const BankAccountEditView = ({ item }: BankAccountEditViewProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const { updateVaultItem } = useModuleCommands(vaultItemsCrudApi);
  const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Set<keyof BankAccountFormFields>>(
    new Set()
  );
  const [bankAccount, setBankAccount] = useState<BankAccount>(item);
  const [displayConfirmDeleteDialog, setDisplayConfirmDeleteDialog] =
    useState(false);
  const {
    areProtectedItemsUnlocked,
    openProtectedItemsUnlocker,
    protectedItemsUnlockerShown,
  } = useProtectedItemsUnlocker();
  const copyAlert = useAlertDisplayLogic();
  const editAlert = useAlert();
  useEffect(() => {
    logPageView(PageView.ItemBankStatementDetails);
  }, []);
  const showListView = () => {
    logPageView(PageView.ItemPaymentList);
    redirect(routes.userPayments);
  };
  const handleEditForm = useCallback(
    (newContent: Partial<BankAccount>) => {
      setBankAccount((currentContent) => {
        const updatedContent = {
          ...currentContent,
          ...newContent,
        };
        setHasDataBeenModified(!equals(updatedContent, item));
        return updatedContent;
      });
    },
    [item]
  );
  const openConfirmDeleteDialog = () => {
    setDisplayConfirmDeleteDialog(true);
  };
  const closeConfirmDeleteDialog = () => {
    setDisplayConfirmDeleteDialog(false);
  };
  const showGenericError = () => {
    editAlert.showAlert(
      translate(I18N_KEYS.GENERIC_ERROR),
      AlertSeverity.ERROR
    );
  };
  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) {
      return;
    }
    const validationResult = validateBankAccountForm(bankAccount);
    if (!validationResult.isValid) {
      return setErrors(validationResult.errorSet);
    }
    setIsSubmitting(true);
    try {
      const updateResult = await updateVaultItem({
        vaultItemType: VaultItemType.BankAccount,
        content: bankAccount,
        id: item.id,
      });
      if (isSuccess(updateResult)) {
        const message = bankAccount.accountName
          ? translate(I18N_KEYS.NAME_UPDATE, {
              accountName: bankAccount.accountName,
            })
          : translate(I18N_KEYS.GENERIC_UPDATE);
        editAlert.showAlert(message, AlertSeverity.SUCCESS);
        showListView();
      } else {
        setIsSubmitting(false);
        showGenericError();
      }
    } catch (error) {
      setIsSubmitting(false);
      showGenericError();
    }
  };
  const showCopyAlert = (message: string) => {
    copyAlert.setAlertMessage(message);
    copyAlert.show();
  };
  const dismissAlert = () => {
    copyAlert.hide();
  };
  const deleteTranslations = {
    confirmDeleteConfirm: translate(I18N_KEYS.DELETE_CONFIRM),
    confirmDeleteDismiss: translate(I18N_KEYS.DELETE_DISMISS),
    confirmDeleteSubtitle: translate(I18N_KEYS.DELETE_SUBTITLE),
    confirmDeleteTitle: translate(I18N_KEYS.DELETE_TITLE),
    deleteSuccessToast: item.accountName
      ? translate(I18N_KEYS.NAME_DELETE, {
          accountName: item.accountName,
        })
      : translate(I18N_KEYS.GENERIC_DELETE),
  };
  const ignoreCloseOnEscape =
    protectedItemsUnlockerShown || displayConfirmDeleteDialog;
  return (
    <EditPanel
      isUsingNewDesign
      onNavigateOut={showListView}
      ignoreCloseOnEscape={ignoreCloseOnEscape}
      formId={FORM_ID}
      onSubmit={handleSubmit}
      header={
        <PanelHeader
          icon={<BankAccountIcon />}
          iconBackgroundColor={colors.dashGreen06}
          title={item.accountName}
        />
      }
      onClickDelete={openConfirmDeleteDialog}
      itemHasBeenEdited={hasDataBeenModified}
      isViewingExistingItem={true}
    >
      <BankAccountForm
        itemId={item.id}
        bankAccount={bankAccount}
        errors={errors}
        onCopy={showCopyAlert}
        onValueChanged={handleEditForm}
        areProtectedItemsUnlocked={areProtectedItemsUnlocked}
        openProtectedItemsUnlocker={openProtectedItemsUnlocker}
        variant="edit"
      />
      <ConfirmDeleteVaultItemDialog
        isVisible={displayConfirmDeleteDialog}
        itemId={item.id}
        closeConfirmDeleteDialog={closeConfirmDeleteDialog}
        onDeletionSuccess={showListView}
        translations={deleteTranslations}
        vaultItemType={VaultItemType.BankAccount}
      />
      {copyAlert.isAlertVisible && (
        <div className={alertStyles.alertWrapper}>
          <Alert
            size={AlertSize.SMALL}
            severity={AlertSeverity.SUCCESS}
            closeIconName={translate(I18N_KEYS.DISMISS)}
            onClose={dismissAlert}
          >
            {copyAlert.alertMessage}
          </Alert>
        </div>
      )}
    </EditPanel>
  );
};
