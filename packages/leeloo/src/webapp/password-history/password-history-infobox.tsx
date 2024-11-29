import { Button, Infobox } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
const I18N_KEYS = {
  PASSWORD_HISTORY_INFOBOX_TITLE:
    "webapp_password_history_dismissable_infobox_title",
  PASSWORD_HISTORY_INFOBOX_CONTENT:
    "webapp_password_history_dismissable_infobox_content",
  PASSWORD_HISTORY_INFOBOX_BUTTON:
    "webapp_password_history_dismissable_infobox_button",
};
interface Props {
  setAsInteracted: () => Promise<void>;
}
export const PasswordHistoryInfobox = ({ setAsInteracted }: Props) => {
  const { translate } = useTranslate();
  return (
    <Infobox
      title={translate(I18N_KEYS.PASSWORD_HISTORY_INFOBOX_TITLE)}
      mood="brand"
      size="large"
      description={translate(I18N_KEYS.PASSWORD_HISTORY_INFOBOX_CONTENT)}
      actions={[
        <Button
          type="button"
          mood="brand"
          key="primary"
          onClick={setAsInteracted}
        >
          {translate(I18N_KEYS.PASSWORD_HISTORY_INFOBOX_BUTTON)}
        </Button>,
      ]}
      sx={{
        marginBottom: "16px",
      }}
    />
  );
};
