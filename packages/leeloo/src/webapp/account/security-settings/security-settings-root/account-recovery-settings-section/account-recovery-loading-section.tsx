import { colors, LoadingIcon } from "@dashlane/ui-components";
import useTranslate from "../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  LOADING_DATA: "webapp_loader_loading",
};
export const AccountRecoveryLoadingSection = () => {
  const { translate } = useTranslate();
  return (
    <div
      id="accountRecoveryLoading"
      sx={{ marginTop: "20px" }}
      title={translate(I18N_KEYS.LOADING_DATA)}
    >
      <LoadingIcon
        color={colors.midGreen01}
        size={40}
        aria-describedby="accountRecoveryLoading"
      />
    </div>
  );
};
