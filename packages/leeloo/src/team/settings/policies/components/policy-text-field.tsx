import { TeamPolicyUpdates } from "@dashlane/team-admin-contracts";
import { FieldWithButton } from "../../../../libs/dashlane-style/field-with-button";
import useTranslate from "../../../../libs/i18n/useTranslate";
import styles from "../../styles.css";
import { SettingFieldProps, SettingTextField } from "../types";
import { I18N_KEYS } from "../constants";
import { useAlertQueue } from "../../../alerts/use-alert-queue";
import { useCallback } from "react";
export type PolicyTextFieldProps = SettingFieldProps & {
  field: SettingTextField;
};
export const PolicyTextField = ({
  field,
  editSettings,
  checkForAuthenticationError,
}: PolicyTextFieldProps) => {
  const { translate } = useTranslate();
  const { reportTACError } = useAlertQueue();
  const multiLine = !!field.multiLine;
  const oldValue = field.deserializer
    ? field.deserializer(field.value)
    : field.value;
  const handleSaveSetting = useCallback(
    async (value: string) => {
      if (!editSettings) {
        return;
      }
      if (field.validator) {
        const serializedValue = field.serializer
          ? field.serializer(value)
          : value;
        const validationError = field.validator(serializedValue);
        if (validationError) {
          throw new Error(field.getErrorMessageForKey?.(validationError));
        }
      }
      if (checkForAuthenticationError?.()) {
        return;
      }
      const policyUpdates = {} as TeamPolicyUpdates;
      if (
        ["disableAutoLoginDomains", "teamDomain"].includes(field.feature ?? "")
      ) {
        const oldDomains = field.value as string[];
        if (oldDomains.length) {
          const newDomains = field.serializer?.(value);
          const oldValuesToRemove = oldDomains.filter(
            (oldDomain: string) =>
              !newDomains.some((newDomain: string) => newDomain === oldDomain)
          );
          const oldDomainsToAdd = newDomains.filter(
            (newDomain: string) =>
              !oldDomains.some((oldDomain) => oldDomain === newDomain)
          );
          if (field.feature) {
            policyUpdates[field.feature] = {
              removed: oldValuesToRemove,
              added: oldDomainsToAdd.map((s: string) => s.toLowerCase()),
            };
          }
        } else if (field.serializer && field.feature) {
          policyUpdates[field.feature] = {
            added: field.serializer(value),
          };
        }
      } else if (field.feature) {
        policyUpdates[field.feature] = field.serializer
          ? field.serializer(value)
          : value;
      }
      if (field.constraintsFromOtherFields) {
        field.constraintsFromOtherFields.requiredFor?.forEach((required) =>
          required.reset?.(policyUpdates)
        );
      }
      if (Object.keys(policyUpdates).length) {
        try {
          await editSettings(policyUpdates);
        } catch (error) {
          reportTACError(error, field.getErrorMessageForKey?.(error.message));
        }
      }
    },
    [checkForAuthenticationError, editSettings, field, reportTACError]
  );
  return (
    <FieldWithButton
      multiLine={multiLine}
      defaultValue={oldValue}
      key={field.label}
      ariaLabelledBy={field.feature}
      saveBtnLabel={translate(I18N_KEYS.BUTTON_SAVE_LABEL)}
      savingBtnLabel={translate(I18N_KEYS.SAVING_LABEL)}
      editBtnLabel={translate(I18N_KEYS.BUTTON_EDIT_LABEL)}
      placeholder={field.hintText}
      inputStyle={field.inputStyle}
      hintStyle={field.hintStyle}
      successMessage={translate(I18N_KEYS.SAVE_SUCCESS_LABEL)}
      onSave={handleSaveSetting}
      textFieldClassName={styles.textFieldInputColumn}
      isDisabled={field.isReadOnly}
    />
  );
};
