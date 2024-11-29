import { Button, Flex, OTPField } from "@dashlane/design-system";
import { DataStatus } from "@dashlane/framework-react";
import useTranslate from "../../../../libs/i18n/useTranslate";
import {
  OTP_DEFAULT_CYCLE_PERIOD_MS,
  useOTPCode,
} from "../../hooks/use-otp-code";
const I18N_KEYS = {
  SECURITY_CODE: "webapp_credential_edition_field_security_code",
  REMOVE_BUTTON: "webapp_credential_otp_code_remove_button",
};
export interface OtpCodeComponentProps {
  readonly secretOrUrl: string;
  readonly onCopy: (success: boolean, err: Error | undefined) => void;
  readonly onDelete: () => void;
  readonly isEditable?: boolean;
}
export const OtpCodeComponent = ({
  secretOrUrl,
  onCopy,
  onDelete,
  isEditable,
}: OtpCodeComponentProps) => {
  const { translate } = useTranslate();
  const { data, status } = useOTPCode(secretOrUrl);
  if (status !== DataStatus.Success || data === undefined || data === null) {
    return null;
  }
  const [code, validityPeriod, validityEndDate] =
    status === DataStatus.Success && data
      ? [data.code, data.validityTime, data.validityEndDate]
      : [null, OTP_DEFAULT_CYCLE_PERIOD_MS, Infinity];
  const copyText = async () => {
    if (!code) {
      return;
    }
    try {
      await navigator.clipboard.writeText(code);
      onCopy(true, undefined);
    } catch (err) {
      onCopy(false, err);
    }
  };
  return (
    <>
      <OTPField
        sx={{ marginTop: "8px" }}
        action={
          code
            ? {
                iconName: "ActionCopyOutlined",
                label: translate(
                  "webapp_credential_edition_field_generic_action_copy"
                ),
                onClick: copyText,
              }
            : undefined
        }
        code={code ?? ""}
        label={translate(I18N_KEYS.SECURITY_CODE)}
        validityEndDate={validityEndDate}
        validityPeriod={validityPeriod}
        data-testid="otp-field"
      />
      {isEditable ? (
        <Flex justifyContent="flex-end">
          <Button
            sx={{ mt: "8px" }}
            size="small"
            icon="ActionCloseOutlined"
            layout="iconTrailing"
            intensity="supershy"
            mood="brand"
            onClick={onDelete}
          >
            {translate(I18N_KEYS.REMOVE_BUTTON)}
          </Button>
        </Flex>
      ) : null}
    </>
  );
};
