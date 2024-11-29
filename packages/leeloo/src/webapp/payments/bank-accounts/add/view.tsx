import { useCallback, useEffect, useRef, useState } from "react";
import { useModuleCommands } from "@dashlane/framework-react";
import { isSuccess } from "@dashlane/framework-types";
import {
  Country,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { AlertSeverity, colors } from "@dashlane/ui-components";
import { PageView } from "@dashlane/hermes";
import { Lee } from "../../../../lee";
import { useAlert } from "../../../../libs/alert-notifications/use-alert";
import { useRouterGlobalSettingsContext } from "../../../../libs/router/RouterGlobalSettingsProvider";
import { getCurrentSpaceId } from "../../../../libs/webapp";
import { PanelTransitionTimeout } from "../../../../libs/router/Routes/PanelTransitionRoute";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../libs/logs/logEvent";
import { redirect } from "../../../../libs/router";
import { useFrozenState } from "../../../../libs/frozen-state/frozen-state-dialog-context";
import { EditPanel, PanelHeader } from "../../../panel";
import {
  BankAccountForm,
  BankAccountFormFields,
  validateBankAccountForm,
} from "../form";
import { BankAccountIcon } from "../icons/bank-account-icon";
import { useSuggestedOwnerName } from "../useSuggestedOwnerName";
const I18N_KEYS = {
  ADD_BANK_ACCOUNT: "webapp_payment_edition_header_add_bank_account",
  GENERIC_ERROR: "_common_generic_error",
  GENERIC_SAVE: "webapp_payment_edition_bank_account_generic_save_alert",
  NAME_DEFAULT: "webapp_payment_edition_bank_account_name_default",
  NAME_SAVE: "webapp_payment_edition_bank_account_name_save_alert",
};
const FORM_ID = "bank-account-add-form";
interface Props {
  lee: Lee;
}
export const BankAccountAddView = ({ lee }: Props) => {
  const [hasDataBeenModified, setHasDataBeenModified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Set<keyof BankAccountFormFields>>(
    new Set()
  );
  const accountNameField = useRef<HTMLInputElement>(null);
  const { createVaultItem } = useModuleCommands(vaultItemsCrudApi);
  const { routes } = useRouterGlobalSettingsContext();
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  useEffect(() => {
    logPageView(PageView.ItemBankStatementCreate);
    const focusTimeout = setTimeout(() => {
      accountNameField.current?.focus();
    }, PanelTransitionTimeout);
    return () => clearTimeout(focusTimeout);
  }, []);
  useEffect(() => {
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
    }
  }, [shouldShowFrozenStateDialog]);
  const [bankAccount, setBankAccount] = useState<BankAccountFormFields>({
    bankCode: "",
    country: Country[lee.globalState.locale.country] || Country.US,
    IBAN: "",
    BIC: "",
    accountName: "",
    ownerName: "",
    spaceId: getCurrentSpaceId(lee.globalState) ?? "",
  });
  const suggestedOwner = useSuggestedOwnerName(bankAccount.spaceId);
  const suggestedOwnerNotEmpty = suggestedOwner !== "";
  useEffect(() => {
    if (suggestedOwner !== "") {
      setBankAccount((previousState) => {
        return {
          ...previousState,
          owner: suggestedOwner,
        };
      });
    }
  }, [suggestedOwnerNotEmpty]);
  const { translate } = useTranslate();
  const { showAlert } = useAlert();
  const showListView = () => {
    logPageView(PageView.ItemPaymentList);
    redirect(routes.userPayments);
  };
  const handleEditedForm = useCallback(
    (newContent: Partial<BankAccountFormFields>, silent = false) => {
      setBankAccount((currentContent) => ({
        ...currentContent,
        ...newContent,
      }));
      if (!silent) {
        setHasDataBeenModified(true);
      }
    },
    []
  );
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
      const createResult = await createVaultItem({
        vaultItemType: VaultItemType.BankAccount,
        content: bankAccount,
      });
      if (isSuccess(createResult)) {
        showAlert(
          bankAccount.accountName
            ? translate(I18N_KEYS.NAME_SAVE, {
                accountName: bankAccount.accountName,
              })
            : translate(I18N_KEYS.GENERIC_SAVE),
          AlertSeverity.SUCCESS
        );
        showListView();
      } else {
        showAlert(translate(I18N_KEYS.GENERIC_ERROR), AlertSeverity.ERROR);
        setIsSubmitting(false);
      }
    } catch (_) {
      showAlert(translate(I18N_KEYS.GENERIC_ERROR), AlertSeverity.ERROR);
      setIsSubmitting(false);
    }
  };
  return (
    <EditPanel
      isUsingNewDesign
      isViewingExistingItem={false}
      itemHasBeenEdited={hasDataBeenModified}
      formId={FORM_ID}
      onNavigateOut={showListView}
      onSubmit={handleSubmit}
      header={
        <PanelHeader
          icon={<BankAccountIcon />}
          iconBackgroundColor={colors.dashGreen06}
          title={translate(I18N_KEYS.ADD_BANK_ACCOUNT)}
        />
      }
    >
      <BankAccountForm
        bankAccount={bankAccount}
        errors={errors}
        ref={accountNameField}
        onValueChanged={handleEditedForm}
        variant="add"
      />
    </EditPanel>
  );
};
