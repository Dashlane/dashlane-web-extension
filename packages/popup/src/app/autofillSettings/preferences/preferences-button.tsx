import { Icon, jsx } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { SX_STYLES } from "./preferences-button.styles";
const I18N_KEYS = {
  PREFERENCES: "tab/autofill_settings/preferences_button",
};
interface Props {
  onClick: () => void;
}
export const PreferencesButton = ({ onClick }: Props) => {
  const { translate } = useTranslate();
  return (
    <button sx={SX_STYLES.CONTAINER} onClick={onClick}>
      <span
        aria-label={translate(I18N_KEYS.PREFERENCES)}
        sx={SX_STYLES.CONTENT}
      >
        <Icon name="SettingsOutlined" size="small" />
        {translate(I18N_KEYS.PREFERENCES)}
      </span>
      <Icon name="CaretRightOutlined" size="small" />
    </button>
  );
};
