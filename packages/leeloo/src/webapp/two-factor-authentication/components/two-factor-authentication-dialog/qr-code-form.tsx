import { Flex } from "@dashlane/design-system";
import { colors, Heading, Paragraph, TextInput } from "@dashlane/ui-components";
import QRCode from "qrcode.react";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  TITLE:
    "webapp_account_security_settings_two_factor_authentication_qr_code_title",
  DESCRIPTION:
    "webapp_account_security_settings_two_factor_authentication_qr_code_description",
  CANT_SCAN:
    "webapp_account_security_settings_two_factor_authentication_qr_code_cant_scan",
  CODE_LABEL:
    "webapp_account_security_settings_two_factor_authentication_qr_code_label",
};
interface Props {
  uri: string;
  seed: string;
}
const HorizontalDivider = () => (
  <hr
    sx={{
      border: "0",
      borderTop: `1px solid ${colors.dashGreen05}`,
      height: "1px",
      width: "100%",
      mt: "8px",
      mb: "8px",
    }}
  />
);
export const QRCodeForm = ({ uri, seed }: Props) => {
  const { translate } = useTranslate();
  return (
    <Flex flexDirection="column">
      <Heading sx={{ mt: "8px", mb: "8px", fontSize: "25px" }} as="span">
        {translate(I18N_KEYS.TITLE)}
      </Heading>
      <Paragraph sx={{ mb: "8px" }} color={colors.grey00}>
        {translate(I18N_KEYS.DESCRIPTION)}
      </Paragraph>

      <div sx={{ alignSelf: "center" }}>
        <QRCode
          sx={{ mt: "24px", mb: "24px" }}
          renderAs="svg"
          size={176}
          value={uri}
        />
      </div>

      <HorizontalDivider />

      <Paragraph color={colors.grey00} bold>
        {translate(I18N_KEYS.CANT_SCAN)}
      </Paragraph>
      <Paragraph sx={{ mb: "16px" }} color={colors.grey00}>
        {translate(I18N_KEYS.CODE_LABEL)}
      </Paragraph>
      <TextInput
        fullWidth
        defaultValue={seed}
        disabled
        sx={{ ":disabled": { color: colors.black } }}
        data-testid="two-factor-authentication-qr-code-alternative"
      />
    </Flex>
  );
};
