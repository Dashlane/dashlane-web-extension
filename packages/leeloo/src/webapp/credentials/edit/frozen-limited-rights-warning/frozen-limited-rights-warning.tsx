import { Infobox } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  INFOBOX_TITLE: "webapp_credential_edition_frozen_limited_rights_title",
  INFOBOX_DESCRIPTION:
    "webapp_credential_edition_frozen_limited_rights_description",
};
export const FrozenLimitedRightsWarning = () => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        position: "relative",
        backgroundColor: "ds.background.default",
        marginBottom: "24px",
      }}
    >
      <Infobox
        title={translate(I18N_KEYS.INFOBOX_TITLE)}
        description={translate(I18N_KEYS.INFOBOX_DESCRIPTION)}
        mood="warning"
        size="medium"
      />
    </div>
  );
};
