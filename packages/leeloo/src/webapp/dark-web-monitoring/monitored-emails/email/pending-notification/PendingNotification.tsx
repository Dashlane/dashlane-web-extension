import { Flex } from "@dashlane/design-system";
import {
  Button,
  colors,
  Heading,
  LightBulbIcon,
  Paragraph,
} from "@dashlane/ui-components";
import useTranslate from "../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  SENT_EMAIL: "webapp_darkweb_email_sent_email",
  VERIFY_EMAIL_CONTENT: "webapp_darkweb_email_verify_email_content",
  VERIFY_EMAIL_TITLE: "webapp_darkweb_email_verify_email_title",
  VERIFY_EMAIL_OK: "webapp_darkweb_email_verify_email_confirmation",
};
export interface PendingNotificationProps {
  email: string;
  handleOnDismiss: () => void;
}
export const PendingNotification = ({
  email,
  handleOnDismiss,
}: PendingNotificationProps) => {
  const { translate } = useTranslate();
  return (
    <Flex
      flexDirection="column"
      alignItems="flex-start"
      sx={{
        textAlign: "left",
        padding: "16px",
        width: "100%",
      }}
    >
      <Flex flexWrap="nowrap" alignItems="center">
        <LightBulbIcon size={24} color={colors.dashGreen00} />
        <Heading
          size="x-small"
          sx={{ ml: "10px", fontWeight: "600", color: colors.black }}
        >
          {translate(I18N_KEYS.VERIFY_EMAIL_TITLE)}
        </Heading>
      </Flex>
      <Paragraph sx={{ mt: "8px", color: colors.dashGreen01 }}>
        {translate(I18N_KEYS.SENT_EMAIL)}
      </Paragraph>
      <Paragraph
        sx={{
          fontWeight: "900",
          mt: "8px",
          mr: "24px",
          color: colors.midGreen00,
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          maxWidth: "327px",
          overflow: "hidden",
        }}
        title={email}
      >
        {email}
      </Paragraph>
      <Paragraph sx={{ mt: "8px", color: colors.dashGreen01 }}>
        {translate(I18N_KEYS.VERIFY_EMAIL_CONTENT)}
      </Paragraph>
      <Button
        sx={{ mt: "32px", mr: "16px", alignSelf: "flex-end" }}
        type="submit"
        onClick={handleOnDismiss}
      >
        {translate(I18N_KEYS.VERIFY_EMAIL_OK)}
      </Button>
    </Flex>
  );
};
