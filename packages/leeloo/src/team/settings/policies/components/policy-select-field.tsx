import { useCallback } from "react";
import { TeamPolicyUpdates } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { SelectWithFeedback } from "../../select";
import { useAlertQueue } from "../../../alerts/use-alert-queue";
import { SettingFieldProps, SettingSelectField } from "../types";
import { I18N_KEYS } from "../constants";
export type SelectSettingFieldProps = SettingFieldProps & {
  field: SettingSelectField;
};
export const PolicySelectField = ({
  field,
  checkForAuthenticationError,
  editSettings,
}: SelectSettingFieldProps) => {
  const { translate } = useTranslate();
  const { reportTACError } = useAlertQueue();
  const handleSelectSettingChange = useCallback(
    async (value: string) => {
      if (!editSettings || checkForAuthenticationError?.() || !field.feature) {
        return;
      }
      const policyUpdates = {} as TeamPolicyUpdates;
      const hasFieldSerializer = field.serializer
        ? field.serializer(value)
        : value;
      const isUnsetValue = value === "unset" ? null : hasFieldSerializer;
      const isDisabledValue = value === "disabled" ? "" : isUnsetValue;
      policyUpdates[field.feature] = isDisabledValue;
      try {
        await editSettings(policyUpdates);
      } catch (error) {
        const content = error.data?.content || {};
        const message = field.getErrorMessageForKey?.(content.error);
        reportTACError(error, message);
      }
    },
    [checkForAuthenticationError, editSettings, field, reportTACError]
  );
  return (
    <SelectWithFeedback
      key={field.label}
      label={field.label}
      value={field.value}
      saveValueFunction={handleSelectSettingChange}
      successMessage={translate(I18N_KEYS.SAVE_SUCCESS_LABEL)}
      savingMessage={translate(I18N_KEYS.SAVING_LABEL)}
      options={field.options}
      isReadOnly={field.isReadOnly}
    />
  );
};
