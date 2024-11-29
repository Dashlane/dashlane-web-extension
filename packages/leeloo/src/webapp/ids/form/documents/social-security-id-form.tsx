import * as React from "react";
import { useFormikContext } from "formik";
import { IdCardUpdateModel } from "@dashlane/communication";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { PanelTransitionTimeout } from "../../../../libs/router/Routes/PanelTransitionRoute";
import { useFrozenState } from "../../../../libs/frozen-state/frozen-state-dialog-context";
import { I18N_KEYS_COMMON } from "../common-fields-translations";
import { CountryField, SpaceField, TextInputField } from "../fields";
import { CopyToClipboardButton } from "../../../credentials/edit/copy-to-clipboard-control";
import { ContentCard } from "../../../panel/standard/content-card";
const I18N_KEYS = {
  ...I18N_KEYS_COMMON,
  DETAILS_CONTENT_LABEL: "webapp_id_form_social_security_content_details_label",
};
interface Props {
  variant: "add" | "edit";
  handleCopy?: (success: boolean, error: Error | undefined) => void;
}
const SocialSecurityIdFormComponent = ({ variant, handleCopy }: Props) => {
  const { translate } = useTranslate();
  const { shouldShowFrozenStateDialog: isDisabled } = useFrozenState();
  const focusField = React.useRef<HTMLInputElement>(null);
  const { values } = useFormikContext<IdCardUpdateModel>();
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
export const SocialSecurityIdForm = React.memo(SocialSecurityIdFormComponent);
