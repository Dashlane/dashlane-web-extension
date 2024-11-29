import { Button, Icon, Paragraph } from "@dashlane/design-system";
import { EmailHeader, Header, WebappLoginLayout } from "../../../components";
import { DOWNLOAD_DASHLANE_URL } from "../../../../../../app/routes/constants";
import useTranslate from "../../../../../../libs/i18n/useTranslate";
export const I18N_KEYS = {
  HEADING: "webapp_device_to_device_authentication_no_extension_title",
  DESCRIPTION:
    "webapp_device_to_device_authentication_no_extension_description",
  BENEFIT_1: "webapp_device_to_device_authentication_no_extension_context_1",
  BENEFIT_2: "webapp_device_to_device_authentication_no_extension_context_2",
  DOWNLOAD_DASHLANE_BUTTON:
    "webapp_device_to_device_authentication_no_extension_install_button",
};
interface DeviceTransferInstructionsProps {
  loginEmail?: string;
}
export const DeviceTransferNoExtension = ({
  loginEmail,
}: DeviceTransferInstructionsProps) => {
  if (!loginEmail) {
    throw new Error("No login email");
  }
  const { translate } = useTranslate();
  const benefitsStyle = {
    padding: "8px",
    marginRight: "16px",
    background: "ds.container.expressive.brand.quiet.disabled",
    borderRadius: "12px",
    width: "40px",
    height: "40px",
  };
  return (
    <WebappLoginLayout>
      <Header text={translate(I18N_KEYS.HEADING)} />

      <EmailHeader selectedEmail={loginEmail} />

      <Paragraph color="ds.text.neutral.quiet">
        {translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>

      <div style={{ display: "flex" }}>
        <Icon
          sx={benefitsStyle}
          name="FeatureAutofillOutlined"
          color="ds.text.brand.standard"
        />
        <Paragraph>{translate(I18N_KEYS.BENEFIT_1)}</Paragraph>
      </div>

      <div style={{ display: "flex", marginBottom: "12px" }}>
        <Icon
          sx={benefitsStyle}
          name="FeatureAutofillOutlined"
          color="ds.text.brand.standard"
        />
        <Paragraph>{translate(I18N_KEYS.BENEFIT_2)}</Paragraph>
      </div>

      <Button
        icon="ActionOpenExternalLinkOutlined"
        layout="iconTrailing"
        size="large"
        fullsize
        onClick={() => {
          window.open(DOWNLOAD_DASHLANE_URL);
        }}
      >
        {translate(I18N_KEYS.DOWNLOAD_DASHLANE_BUTTON)}
      </Button>
    </WebappLoginLayout>
  );
};
