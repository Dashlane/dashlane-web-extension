import { Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { AvatarWithAbbreviatedText } from "../../../../libs/dashlane-style/avatar/avatar-with-abbreviated-text";
const MENU_MAX_WIDTH = "240px";
const I18N_KEYS = {
  EMAIL_LABEL: "manage_subscription_account_menu_email",
};
interface UserProfileProps {
  login: string;
}
export const UserProfile = ({ login }: UserProfileProps) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        padding: "12px",
        maxWidth: MENU_MAX_WIDTH,
      }}
    >
      <AvatarWithAbbreviatedText
        avatarSize={36}
        email={login}
        placeholderFontSize={18}
        placeholderTextType="firstTwoCharacters"
      />
      <Paragraph
        as="header"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
        sx={{ margin: "12px 0 4px" }}
      >
        {translate(I18N_KEYS.EMAIL_LABEL)}
      </Paragraph>
      <Paragraph
        textStyle="ds.body.reduced.regular"
        color="ds.text.neutral.standard"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
      >
        {login}
      </Paragraph>
    </div>
  );
};
