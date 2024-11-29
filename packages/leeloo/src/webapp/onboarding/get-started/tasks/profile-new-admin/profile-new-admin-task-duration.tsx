import { Icon, Paragraph } from "@dashlane/design-system";
import useTranslate from "../../../../../libs/i18n/useTranslate";
export const I18N_KEYS = {
  DURATION: "onb_vault_get_started_task_profile_new_admin_duration",
};
const PROFILE_NEW_ADMIN_TASK_DURATION = 3;
export const ProfileNewAdminDuration = () => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "4px",
      }}
    >
      <Icon name="TimeOutlined" size="xsmall" color="ds.text.neutral.quiet" />
      <Paragraph
        textStyle="ds.body.helper.regular"
        color="ds.text.neutral.quiet"
      >
        {translate(I18N_KEYS.DURATION, {
          count: PROFILE_NEW_ADMIN_TASK_DURATION,
        })}
      </Paragraph>
    </div>
  );
};
