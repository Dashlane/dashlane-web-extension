import { ChangeEvent } from "react";
import { Heading, Paragraph, Toggle } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  SPLUNK_SELF_SIGNED_CERIFICATE_SUBTITLE:
    "team_settings_splunk_configuration_splunk_self_signed_certificate_subtitle",
  SPLUNK_SELF_SIGNED_CERIFICATE_TITLE:
    "team_settings_splunk_configuration_splunk_self_signed_certificate_title",
  SPLUNK_SELF_SIGNED_CERIFICATE_DESCRIPTION:
    "team_settings_splunk_configuration_splunk_self_signed_certificate_description",
};
export const SplunkSelfSignedCertificate = ({
  defaultValue,
  onChange,
  disabled,
}: {
  defaultValue: boolean;
  onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
}) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        backgroundColor: "ds.container.agnostic.neutral.quiet",
        borderRadius: "8px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <Heading
        as="h3"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.SPLUNK_SELF_SIGNED_CERIFICATE_SUBTITLE)}
      </Heading>
      <div
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: "16px",
          justifyContent: "space-between",
        }}
      >
        <div
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <Heading
            as="h2"
            textStyle="ds.title.block.medium"
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEYS.SPLUNK_SELF_SIGNED_CERIFICATE_TITLE)}
          </Heading>
          <Paragraph
            textStyle="ds.body.standard.regular"
            color="ds.text.neutral.standard"
          >
            {translate(I18N_KEYS.SPLUNK_SELF_SIGNED_CERIFICATE_DESCRIPTION)}
          </Paragraph>
        </div>
        <Toggle
          aria-label="selfSignedCertToggle"
          onChange={onChange}
          defaultChecked={defaultValue}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
