import { ChangeEvent } from "react";
import { Button, WebsiteField } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ButtonsOnHover } from "../../../../libs/dashlane-style/buttons-on-hover";
import DetailField from "../../../../libs/dashlane-style/detail-field";
import { OpenWebsiteIcon, Tooltip } from "@dashlane/ui-components";
const I18N_KEYS = {
  WEBSITE: "webapp_credential_edition_field_website",
  PLACEHOLDER_NO_URL: "webapp_credential_edition_field_placeholder_no_url",
  GO_TO_WEBSITE: "webapp_credential_edition_field_website_action_goto",
};
interface Props {
  url: string;
  hasUrlError: boolean;
  editViewButtonEnabled: boolean;
  handleChange: (eventOrValue: ChangeEvent<any> | any, key?: string) => void;
  handleGoToWebsite: () => void;
  isWebsiteFieldReadonly: boolean;
  disabled?: boolean;
  isUsingNewDesign?: boolean;
}
export const MainWebsiteField = ({
  url,
  hasUrlError,
  disabled,
  editViewButtonEnabled,
  isWebsiteFieldReadonly,
  handleChange,
  handleGoToWebsite,
  isUsingNewDesign = false,
}: Props) => {
  const { translate } = useTranslate();
  if (isUsingNewDesign) {
    return (
      <WebsiteField
        data-name="URL"
        label={translate(I18N_KEYS.WEBSITE)}
        placeholder={translate(I18N_KEYS.PLACEHOLDER_NO_URL)}
        disabled={disabled || (!url && isWebsiteFieldReadonly)}
        value={url}
        error={hasUrlError}
        readOnly={!!url && isWebsiteFieldReadonly}
        onChange={handleChange}
        sx={{ marginTop: "8px" }}
        showOpenWebsite={
          editViewButtonEnabled
            ? {
                label: translate(I18N_KEYS.GO_TO_WEBSITE),
                onClick: handleGoToWebsite,
              }
            : undefined
        }
      />
    );
  }
  return (
    <ButtonsOnHover enabled={editViewButtonEnabled} disableHover={true}>
      <DetailField
        label={translate(I18N_KEYS.WEBSITE)}
        placeholder={translate(I18N_KEYS.PLACEHOLDER_NO_URL)}
        dataName="URL"
        disabled={disabled}
        value={url}
        error={hasUrlError}
        readOnly={isWebsiteFieldReadonly}
        onChange={handleChange}
      />
      <Tooltip placement="top" content={translate(I18N_KEYS.GO_TO_WEBSITE)}>
        <Button
          mood="neutral"
          intensity="supershy"
          type="button"
          onClick={handleGoToWebsite}
          sx={{
            border: "none",
            minWidth: "fit-content",
            padding: "10px",
          }}
          role="link"
          aria-label={translate(I18N_KEYS.GO_TO_WEBSITE)}
        >
          <OpenWebsiteIcon />
        </Button>
      </Tooltip>
    </ButtonsOnHover>
  );
};
