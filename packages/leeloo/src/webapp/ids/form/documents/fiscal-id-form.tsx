import * as React from "react";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { PanelTransitionTimeout } from "../../../../libs/router/Routes/PanelTransitionRoute";
import { I18N_KEYS_COMMON } from "../common-fields-translations";
import {
  CountryField,
  SpaceField,
  TeledeclarantNumberField,
  TextInputField,
} from "../fields";
import { useFrozenState } from "../../../../libs/frozen-state/frozen-state-dialog-context";
import { ContentCard } from "../../../panel/standard/content-card";
import { CopyToClipboardButton } from "../../../credentials/edit/copy-to-clipboard-control";
import { useFormikContext } from "formik";
import { FiscalIdFormFields } from "../../types";
const I18N_KEYS = {
  ...I18N_KEYS_COMMON,
  TELEDECLARANT_NUMBER_LABEL: "webapp_id_form_field_label_teledeclarant_number",
  TELEDECLARANT_NUMBER_PLACEHOLDER:
    "webapp_id_form_field_placeholder_teledeclarant_number",
  TAX_NUMBER_LABEL_DEFAULT: "webapp_id_form_field_label_tax_number",
  DETAILS_CONTENT_LABEL: "webapp_id_form_fiscal_id_content_details_label",
};
interface Props {
  variant: "add" | "edit";
  handleCopy?: (success: boolean, error: Error | undefined) => void;
}
const FiscalIdFormComponent = ({ variant, handleCopy }: Props) => {
  const { translate } = useTranslate();
  const { shouldShowFrozenStateDialog: isDisabled } = useFrozenState();
  const { values } = useFormikContext<FiscalIdFormFields>();
  const focusField = React.useRef<HTMLInputElement>(null);
  React.useEffect(
    variant === "add"
      ? () => {
          const focusTimeout = setTimeout(() => {
            focusField.current?.focus();
          }, PanelTransitionTimeout);
          return () => clearTimeout(focusTimeout);
        }
      : () => {},
    []
  );
  return (
    <>
      <ContentCard
        title={translate(I18N_KEYS.DETAILS_CONTENT_LABEL)}
        additionalSx={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <TextInputField
          name="fiscalNumber"
          label={translate(I18N_KEYS.TAX_NUMBER_LABEL_DEFAULT)}
          placeholder={translate(I18N_KEYS.ID_NUMBER_PLACEHOLDER)}
          actions={
            variant === "edit"
              ? [
                  <CopyToClipboardButton
                    key="copy"
                    data={values["fiscalNumber"]}
                    onCopy={handleCopy}
                  />,
                ]
              : undefined
          }
          ref={focusField}
          disabled={!!isDisabled}
        />
        <TeledeclarantNumberField
          name="teledeclarantNumber"
          label={translate(I18N_KEYS.TELEDECLARANT_NUMBER_LABEL)}
          placeholder={translate(I18N_KEYS.TELEDECLARANT_NUMBER_PLACEHOLDER)}
          handleCopy={variant === "edit" ? handleCopy : undefined}
          disabled={!!isDisabled}
        />
        <CountryField
          name="country"
          label={translate(I18N_KEYS.COUNTRY_LABEL)}
          disabled={!!isDisabled}
        />
      </ContentCard>
      <SpaceField
        name="spaceId"
        disabled={!!isDisabled}
        wrapInContentCard
        contentCardLabel={translate(I18N_KEYS.ORGANIZATION_CONTENT_LABEL)}
      />
    </>
  );
};
export const FiscalIdForm = React.memo(FiscalIdFormComponent);
