import * as React from "react";
import { useFormikContext } from "formik";
import { IdCardUpdateModel } from "@dashlane/communication";
import { Country } from "@dashlane/vault-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { PanelTransitionTimeout } from "../../../../libs/router/Routes/PanelTransitionRoute";
import { useFrozenState } from "../../../../libs/frozen-state/frozen-state-dialog-context";
import { ContentCard } from "../../../panel/standard/content-card";
import { countriesUsingExpiry } from "../countries-using-expiry";
import { I18N_KEYS_COMMON } from "../common-fields-translations";
import { CountryField, DateField, SpaceField, TextInputField } from "../fields";
import { CopyToClipboardButton } from "../../../credentials/edit/copy-to-clipboard-control";
const I18N_KEYS = {
  ...I18N_KEYS_COMMON,
  DETAILS_CONTENT_LABEL: "webapp_id_form_id_card_content_details_label",
};
interface Props {
  variant: "add" | "edit";
  handleCopy?: (success: boolean, error: Error | undefined) => void;
  country: Country;
}
const IdCardFormComponent = ({ variant, handleCopy, country }: Props) => {
  const { translate } = useTranslate();
  const { shouldShowFrozenStateDialog: isDisabled } = useFrozenState();
  const { values } = useFormikContext<IdCardUpdateModel>();
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
          name="idName"
          label={translate(I18N_KEYS.NAME_LABEL)}
          placeholder={translate(I18N_KEYS.NAME_PLACEHOLDER)}
          ref={focusField}
          disabled={!!isDisabled}
        />
        <TextInputField
          name="idNumber"
          label={translate(I18N_KEYS.ID_NUMBER_LABEL)}
          placeholder={translate(I18N_KEYS.ID_NUMBER_PLACEHOLDER)}
          actions={
            variant === "edit"
              ? [
                  <CopyToClipboardButton
                    key="copy"
                    data={values["idNumber"]}
                    onCopy={handleCopy}
                  />,
                ]
              : undefined
          }
          disabled={!!isDisabled}
        />
        <DateField
          name="issueDate"
          label={translate(I18N_KEYS.ISSUE_DATE_LABEL)}
          disabled={!!isDisabled}
          calendarButtonLabel={translate(I18N_KEYS.ISSUE_DATE_PICK)}
        />
        <DateField
          name="expirationDate"
          label={translate(
            countriesUsingExpiry.has(country)
              ? I18N_KEYS.EXPIRATION_DATE_LABEL_UK
              : I18N_KEYS.EXPIRATION_DATE_LABEL_US
          )}
          calendarButtonLabel={translate(
            countriesUsingExpiry.has(country)
              ? I18N_KEYS.EXPIRATION_DATE_PICK_UK
              : I18N_KEYS.EXPIRATION_DATE_PICK_US
          )}
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
export const IdCardForm = React.memo(IdCardFormComponent);
