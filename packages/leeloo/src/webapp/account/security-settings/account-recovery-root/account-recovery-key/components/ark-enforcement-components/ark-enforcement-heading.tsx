import { ButtonMood, ExpressiveIcon, Heading } from "@dashlane/design-system";
import useTranslate from "../../../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  TITLE:
    "webapp_account_security_settings_account_recovery_section_recovery_key_title",
};
interface Props {
  title: string;
  iconMood?: ButtonMood;
  iconName?:
    | "RecoveryKeyOutlined"
    | "FeedbackSuccessOutlined"
    | "FeedbackFailOutlined";
  isSuccess?: boolean;
}
export const AccountRecoveryKeyEnforcementHeading = ({
  title,
  iconMood = "brand",
  iconName,
  isSuccess,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <div>
      {iconName ? (
        <>
          <ExpressiveIcon name={iconName} mood={iconMood} size="large" />
          <Heading
            as="h1"
            textStyle="ds.title.supporting.small"
            color="ds.text.neutral.quiet"
            sx={{ textTransform: "uppercase", margin: "16px 0 8px 0" }}
          >
            {translate(I18N_KEYS.TITLE)}
          </Heading>
        </>
      ) : null}

      <Heading
        sx={!isSuccess ? { marginBottom: "16px" } : undefined}
        as="h2"
        textStyle={"ds.title.section.large"}
      >
        {title}
      </Heading>
    </div>
  );
};
