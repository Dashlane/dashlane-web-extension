import { Dialog, Paragraph } from "@dashlane/design-system";
import { NotificationName } from "@dashlane/communication";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useNotificationSeen } from "../../../libs/carbon/hooks/useNotificationStatus";
const I18N_KEYS = {
  MP_TO_SSO_MIGRATION_TITLE: "mp_to_sso_migration_done_dialog_title",
  MP_TO_SSO_MIGRATION_DESCRIPTION:
    "mp_to_sso_migration_done_dialog_description",
  MP_TO_SSO_MIGRATION_GOT_IT: "mp_to_sso_migration_done_dialog_cta",
  CLOSE: "_common_dialog_dismiss_button",
};
export const SSOActivatedDialog = () => {
  const { translate } = useTranslate();
  const { unseen, setAsSeen } = useNotificationSeen(
    NotificationName.MpToSsoMigrationDoneDialog
  );
  return (
    <Dialog
      actions={{
        primary: {
          children: translate(I18N_KEYS.MP_TO_SSO_MIGRATION_GOT_IT),
          onClick: setAsSeen,
        },
      }}
      isOpen={unseen}
      closeActionLabel={translate(I18N_KEYS.CLOSE)}
      onClose={setAsSeen}
      title={translate(I18N_KEYS.MP_TO_SSO_MIGRATION_TITLE)}
    >
      <Paragraph
        color="ds.text.neutral.quiet"
        textStyle="ds.body.standard.regular"
      >
        {translate(I18N_KEYS.MP_TO_SSO_MIGRATION_DESCRIPTION)}
      </Paragraph>
    </Dialog>
  );
};
