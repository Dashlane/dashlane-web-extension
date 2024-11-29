import { ChangeEvent, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Icon,
  Infobox,
  Paragraph,
  TextArea,
  useToast,
} from "@dashlane/design-system";
import { DataStatus } from "@dashlane/framework-react";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { ContentCard } from "../../../panel/standard/content-card";
import { useOTPCode } from "../../hooks/use-otp-code";
import { useSetupOtpCodeForCredential } from "./use-setup-otp-code-for-credential";
import { SetupOtpCodeStep } from "./setup-otp-code-step";
export interface SetupOtpDialogProps {
  onClose: () => void;
  onSubmit: () => void;
  setHasDataBeenModified: (value: boolean) => void;
  credentialId: string;
  url: string;
  title: string;
}
export const I18N_KEYS = {
  HEADER: "webapp_credential_otp_setup_sublevel_header",
  TITLE: "webapp_credential_otp_setup_title",
  STEP_1_TITLE: "webapp_credential_otp_setup_step1_title_markup",
  STEP_2_TITLE: "webapp_credential_otp_setup_step2_title",
  STEP_3_TITLE: "webapp_credential_otp_setup_step3_title",
  STEP_1_DESCRIPTION: "webapp_credential_otp_setup_step1_description",
  STEP_2_DESCRIPTION: "webapp_credential_otp_setup_step2_description",
  STEP_3_DESCRIPTION: "webapp_credential_otp_setup_step3_description",
  ENTER_CODE_LABEL: "webapp_credential_otp_setup_code_label",
  SUBMIT_BUTTON: "webapp_credential_otp_setup_submit_button",
  CLOSE_BUTTON: "webapp_credential_otp_setup_close_button",
  SUBMIT_BUTTON_DISABLED_TOOLTIP:
    "webapp_credential_otp_setup_submit_button_disabled_tooltip",
  INCORRECT_CODE_ERROR:
    "webapp_credential_otp_setup_incorrect_setup_code_error",
  INFOBOX_TITLE: "webapp_credential_otp_code_cant_find_code_title",
  INFOBOX_DESCRIPTION: "webapp_credential_otp_code_cant_find_code_description",
  SUCCESS_TOAST: "webapp_credential_otp_code_success_toast",
  GENERIC_ERROR: "_common_generic_error",
};
export const SetupOtpCodeCard = ({
  credentialId,
  title,
  url,
  setHasDataBeenModified,
  onClose,
  onSubmit,
}: SetupOtpDialogProps) => {
  const { translate } = useTranslate();
  const [setupCode, setSetupCode] = useState<string>("");
  const otpCodeResult = useOTPCode(setupCode);
  const { setupOtpCode } = useSetupOtpCodeForCredential();
  const { showToast } = useToast();
  const hasErrors = !!setupCode && otpCodeResult.status === DataStatus.Error;
  const shouldDisableSubmit = otpCodeResult.status !== DataStatus.Success;
  const handleSubmit = async () => {
    if (otpCodeResult.status === DataStatus.Success) {
      const isSuccess = await setupOtpCode(
        credentialId,
        otpCodeResult.data.url
      );
      if (isSuccess) {
        onSubmit();
        showToast({ description: translate(I18N_KEYS.SUCCESS_TOAST) });
      } else {
        showToast({
          mood: "danger",
          description: translate(I18N_KEYS.GENERIC_ERROR),
        });
      }
    }
  };
  const onCodeChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setHasDataBeenModified(true);
    setSetupCode(event.target.value);
  };
  return (
    <div data-testid="linked-websites-tab">
      <Button
        data-testid="back-button"
        layout="iconLeading"
        mood="neutral"
        intensity="supershy"
        size="large"
        onClick={onClose}
        icon={<Icon name="ArrowLeftOutlined" />}
      >
        <Paragraph
          textStyle="ds.title.section.medium"
          color="ds.text.neutral.catchy"
        >
          {translate(I18N_KEYS.HEADER)}
        </Paragraph>
      </Button>
      <ContentCard
        additionalSx={{
          marginTop: "16px",
        }}
      >
        <Flex as="ol" gap="16px">
          <Heading
            as="h3"
            textStyle="ds.title.supporting.small"
            color="ds.text.neutral.quiet"
          >
            {translate(I18N_KEYS.TITLE)}
          </Heading>
          <SetupOtpCodeStep
            rank={1}
            key="2fa-settings"
            content={translate(I18N_KEYS.STEP_1_DESCRIPTION)}
            title={translate.markup(
              I18N_KEYS.STEP_1_TITLE,
              {
                title: title,
                url: url,
              },
              { linkTarget: "_blank" }
            )}
          />
          <SetupOtpCodeStep
            rank={2}
            key="2fa-turn-on"
            content={translate(I18N_KEYS.STEP_2_DESCRIPTION)}
            title={translate(I18N_KEYS.STEP_2_TITLE)}
          />
          <SetupOtpCodeStep
            rank={3}
            key="enter-setup-code"
            content={translate(I18N_KEYS.STEP_3_DESCRIPTION)}
            title={translate(I18N_KEYS.STEP_3_TITLE)}
          />
        </Flex>
        <Flex
          sx={{
            mt: "16px",
            backgroundColor: "ds.container.agnostic.neutral.quiet",
            padding: "16px",
            borderRadius: "8px",
          }}
          gap="8px"
          flexDirection="column"
        >
          <TextArea
            error={hasErrors}
            feedback={
              hasErrors ? translate(I18N_KEYS.INCORRECT_CODE_ERROR) : ""
            }
            label={translate(I18N_KEYS.ENTER_CODE_LABEL)}
            onChange={onCodeChange}
          />
          <Button
            fullsize
            onClick={handleSubmit}
            disabled={shouldDisableSubmit}
            tooltip={translate(I18N_KEYS.SUBMIT_BUTTON_DISABLED_TOOLTIP)}
          >
            {translate(I18N_KEYS.SUBMIT_BUTTON)}
          </Button>
        </Flex>
      </ContentCard>
      <Infobox
        sx={{ mt: "16px" }}
        title={translate(I18N_KEYS.INFOBOX_TITLE)}
        description={translate(I18N_KEYS.INFOBOX_DESCRIPTION)}
      />
    </div>
  );
};
