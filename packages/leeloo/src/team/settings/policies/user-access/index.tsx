import useTranslate from "../../../../libs/i18n/useTranslate";
import { useIsTeamDiscontinuedAfterTrial } from "../../../../libs/hooks/use-is-team-discontinued-after-trial";
import { useGetTeamName } from "../../../hooks/use-get-team-name";
import { PolicySettingsWrapper } from "../components/policy-settings-wrapper";
import { SettingsGroupHeading } from "../../components/layout/settings-group-heading";
import { SettingHeader } from "../types";
import { InviteLinkSetting } from "./invite-link-setting";
const I18N_KEYS = {
  HEADER: "team_settings_header_user_access",
};
export const UserAccessPolicy = () => {
  const { translate } = useTranslate();
  const teamName = useGetTeamName();
  const isTeamDiscontinuedAfterTrial = useIsTeamDiscontinuedAfterTrial();
  const inviteLinkHeader: SettingHeader = {
    type: "header",
    label: translate(I18N_KEYS.HEADER),
  };
  if (!teamName || isTeamDiscontinuedAfterTrial === null) {
    return null;
  }
  return (
    <PolicySettingsWrapper>
      <SettingsGroupHeading header={inviteLinkHeader} />
      <InviteLinkSetting
        teamName={teamName}
        isTeamDiscontinuedAfterTrial={isTeamDiscontinuedAfterTrial}
      />
    </PolicySettingsWrapper>
  );
};
