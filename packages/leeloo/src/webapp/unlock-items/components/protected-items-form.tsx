import { useCallback, useState } from "react";
import { Form, Formik, FormikProps } from "formik";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  AlertSeverity,
  Checkbox,
  InfoBox,
  Paragraph,
  PasswordInput,
} from "@dashlane/ui-components";
import { Button, Flex } from "@dashlane/design-system";
import { UnlockProtectedItemsStatus } from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
import {
  logChangeMasterPasswordProtectSetting,
  logCredentialProtectionChange,
} from "../logs";
import { useAlert } from "../../../libs/alert-notifications/use-alert";
import { ProtectedItemsUnlockedDialog } from "./protected-items-unlocked";
import {
  LockedItemType,
  ProtectedItemsUnlockRequest,
  UnlockRequestCustomizableField,
} from "../types";
import { useProtectedItemsUnlockDismiss } from "../hooks/use-protected-items-unlock-dismiss";
import { useProtectedItemsUnlockSuccess } from "../hooks/use-protected-items-unlock-success";
import { getUnlockRequestTranslationOption } from "../helpers";
const I18N_KEYS = {
  DISMISS: "webapp_lock_items_cancel",
  CONFIRM: "webapp_lock_items_show",
  CONFIRM_COPY: "webapp_lock_items_copy",
  PLACEHOLDER: "webapp_lock_items_password_placeholder",
  WRONG_PASSWORD: "webapp_lock_items_wrong_password",
  SHOW_LABEL: "webapp_lock_items_password_show_label",
  HIDE_LABEL: "webapp_lock_items_password_hide_label",
  CHECKBOX_LABEL_GLOBAL_SETTING:
    "webapp_lock_items_require_master_password_never_ask_checkbox_label",
  CHECKBOX_LABEL_FOR_CREDENTIAL:
    "webapp_lock_items_require_master_password_never_ask_checkbox_label_for_credential",
  CHECKBOX_WARNING:
    "webapp_lock_items_require_master_password_never_ask_checkbox_warning",
  CHECKBOX_SUCCESS_GLOBAL:
    "webapp_lock_items_require_master_password_never_ask_checkbox_success_alert",
  CHECKBOX_SUCCESS_CREDENTIAL:
    "webapp_lock_items_require_master_password_never_ask_checkbox_success_alert_for_credential",
};
const { Subtitle, Confirm, Placeholder } = UnlockRequestCustomizableField;
type ProtectedItemsFormProps = ProtectedItemsUnlockRequest & {
  requirePasswordGlobalSetting?: boolean;
};
export const ProtectedItemsForm = ({
  unlockRequest,
  setUnlockRequest,
  requirePasswordGlobalSetting = false,
}: ProtectedItemsFormProps) => {
  const { options } = unlockRequest;
  const { translate } = useTranslate();
  const alert = useAlert();
  const { handleDismiss } = useProtectedItemsUnlockDismiss({
    unlockRequest,
    setUnlockRequest,
  });
  const { verify, handleSuccess, onSuccessWithLogs } =
    useProtectedItemsUnlockSuccess({
      unlockRequest,
      setUnlockRequest,
    });
  const [error, setError] = useState(false);
  const setNoErrorState = useCallback(() => setError(false), []);
  if (verify) {
    return (
      <ProtectedItemsUnlockedDialog
        onDismiss={handleDismiss}
        onSuccess={handleSuccess}
      />
    );
  }
  const getTranslatedValue = (field: UnlockRequestCustomizableField) => {
    const translation = getUnlockRequestTranslationOption(field, options);
    if (translation) {
      return translation.translated
        ? translation.field
        : translate(translation.key);
    }
    const defaultValue = I18N_KEYS[field.toUpperCase()];
    return defaultValue ? translate(defaultValue) : null;
  };
  const handleSubmitPassword = async (values: {
    password: string;
    neverAskCheckbox: boolean;
  }) => {
    const commandResult = await carbonConnector.unlockProtectedItems(
      values.password
    );
    switch (commandResult.status) {
      case UnlockProtectedItemsStatus.SUCCESS:
        if (values.neverAskCheckbox) {
          if (requirePasswordGlobalSetting) {
            await carbonConnector.updateProtectPasswordsSetting(false);
            logChangeMasterPasswordProtectSetting(false);
            alert.showAlert(
              translate(I18N_KEYS.CHECKBOX_SUCCESS_GLOBAL),
              AlertSeverity.SUCCESS
            );
          } else if (unlockRequest.itemType === LockedItemType.Password) {
            const credential = await carbonConnector.getCredential(
              unlockRequest.credentialId
            );
            await carbonConnector.disableCredentialProtection({
              credentialId: unlockRequest.credentialId,
            });
            logCredentialProtectionChange(
              false,
              credential.id,
              credential.url,
              credential.spaceId ?? undefined
            );
            alert.showAlert(
              translate(I18N_KEYS.CHECKBOX_SUCCESS_CREDENTIAL),
              AlertSeverity.SUCCESS
            );
          }
        }
        onSuccessWithLogs();
        break;
      case UnlockProtectedItemsStatus.ERROR:
      default:
        setError(true);
        break;
    }
  };
  const subtitle = getTranslatedValue(Subtitle);
  const initialValues = { password: "", neverAskCheckbox: false };
  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={handleSubmitPassword}>
        {({
          values,
          handleChange,
          isSubmitting,
        }: FormikProps<typeof initialValues>) => (
          <Form>
            {subtitle ? (
              <Paragraph sx={{ marginBottom: "27px" }}>{subtitle}</Paragraph>
            ) : null}

            <PasswordInput
              name="password"
              value={values.password}
              autoFocus
              placeholder={getTranslatedValue(Placeholder) as string}
              onChange={(e) => {
                handleChange(e);
                setNoErrorState();
              }}
              showPasswordTooltipText={translate(I18N_KEYS.SHOW_LABEL)}
              hidePasswordTooltipText={translate(I18N_KEYS.HIDE_LABEL)}
              feedbackType={error ? "error" : undefined}
              feedbackText={
                error ? translate(I18N_KEYS.WRONG_PASSWORD) : undefined
              }
            />
            {unlockRequest.itemType === LockedItemType.Password &&
            unlockRequest.showNeverAskOption ? (
              <>
                <Checkbox
                  name="neverAskCheckbox"
                  data-testid="neverAskCheckbox"
                  checked={values.neverAskCheckbox}
                  onChange={handleChange}
                  sx={{ margin: "12px 0px" }}
                  label={
                    requirePasswordGlobalSetting
                      ? translate(I18N_KEYS.CHECKBOX_LABEL_GLOBAL_SETTING)
                      : translate(I18N_KEYS.CHECKBOX_LABEL_FOR_CREDENTIAL)
                  }
                />
                {requirePasswordGlobalSetting && (
                  <InfoBox
                    severity="warning"
                    size="small"
                    title={translate(I18N_KEYS.CHECKBOX_WARNING)}
                  />
                )}
              </>
            ) : null}
            <Flex
              gap="16px"
              justifyContent="flex-end"
              sx={{
                maxWidth: "100%",
                marginTop: "40px",
              }}
            >
              <Button onClick={handleDismiss} mood="neutral" intensity="quiet">
                {translate(I18N_KEYS.DISMISS)}
              </Button>
              <Button
                id="protected-items-unlocker-confirm-button"
                type="submit"
                disabled={isSubmitting || !values.password}
              >
                {getTranslatedValue(Confirm)}
              </Button>
            </Flex>
          </Form>
        )}
      </Formik>
    </div>
  );
};
