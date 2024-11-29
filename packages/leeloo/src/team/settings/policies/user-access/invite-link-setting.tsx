import { useEffect } from "react";
import { Paragraph } from "@dashlane/design-system";
import { AvailableFeatureFlips } from "@dashlane/team-admin-contracts";
import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { CopyButton } from "../../../../libs/dashlane-style/copy-button";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useInviteLinkData } from "../../hooks/useInviteLinkData";
import { useInviteLinkDataGraphene } from "../../hooks/use-invite-link";
import { getInviteLinkWithTeamKey } from "../../../urls";
import { PolicySetting } from "../components/policy-setting";
import { SettingField } from "../types";
const I18N_KEYS = {
  TOGGLE_LABEL: "team_settings_enable_invite_link_label",
  TOGGLE_HELP_TEXT: "team_settings_disable_enable_invite_link_helper",
  GENERIC_ERROR: "_common_generic_error",
};
interface InviteLinkSettingProps {
  teamName: string;
  isTeamDiscontinuedAfterTrial: boolean;
}
export const InviteLinkSetting = ({
  teamName,
  isTeamDiscontinuedAfterTrial,
}: InviteLinkSettingProps) => {
  const { translate } = useTranslate();
  const inviteLinkDataGraphene = useInviteLinkDataGraphene();
  const inviteLinkTacMigrationFeatureFlip = useFeatureFlip(
    AvailableFeatureFlips.WebOnboardingInviteLinkTacMigration
  );
  const shouldUseInviteLinkDataGraphene =
    inviteLinkTacMigrationFeatureFlip === true;
  const {
    inviteLinkDataForAdmin,
    getInviteLinkDataForAdmin,
    inviteLinkDataLoading,
    createInviteLink,
    toggleInviteLink,
  } = useInviteLinkData();
  useEffect(() => {
    if (!shouldUseInviteLinkDataGraphene) {
      void getInviteLinkDataForAdmin();
    }
  }, [getInviteLinkDataForAdmin, shouldUseInviteLinkDataGraphene]);
  const inviteLinkData = shouldUseInviteLinkDataGraphene
    ? inviteLinkDataGraphene.status === DataStatus.Success
      ? inviteLinkDataGraphene
      : null
    : inviteLinkDataForAdmin;
  const inviteLinkEnabled = shouldUseInviteLinkDataGraphene
    ? inviteLinkDataGraphene.status === DataStatus.Success
      ? inviteLinkDataGraphene.enabled
      : null
    : !inviteLinkDataForAdmin?.disabled;
  const inviteLink = getInviteLinkWithTeamKey(inviteLinkData?.teamKey);
  const grapheneSwitchHandler = async () => {
    if (inviteLinkDataGraphene.status === DataStatus.Success) {
      await inviteLinkDataGraphene
        .sendToggleInviteLink(!inviteLinkEnabled)
        .catch(() => {
          throw Error(translate(I18N_KEYS.GENERIC_ERROR));
        });
    }
  };
  const legacySwitchHandler = async () => {
    const teamKey = inviteLinkData?.teamKey;
    if (!teamKey) {
      const createResponse = await createInviteLink(teamName);
      if (!createResponse) {
        throw Error(translate(I18N_KEYS.GENERIC_ERROR));
      }
    } else {
      const toggleResponse = await toggleInviteLink(inviteLinkEnabled ?? true);
      if (!toggleResponse) {
        throw Error(translate(I18N_KEYS.GENERIC_ERROR));
      }
    }
    const getResponse = await getInviteLinkDataForAdmin();
    if (!getResponse) {
      throw Error(translate(I18N_KEYS.GENERIC_ERROR));
    }
  };
  const inviteLinkSwitch: SettingField = {
    type: "switch",
    isLoading: shouldUseInviteLinkDataGraphene
      ? inviteLinkDataGraphene.status === DataStatus.Loading
      : inviteLinkDataLoading,
    label: translate(I18N_KEYS.TOGGLE_LABEL),
    isReadOnly: isTeamDiscontinuedAfterTrial,
    feature: "inviteLink",
    value: inviteLinkEnabled === true,
    customSwitchHandler: shouldUseInviteLinkDataGraphene
      ? grapheneSwitchHandler
      : legacySwitchHandler,
    helperLabel: (
      <>
        {translate(I18N_KEYS.TOGGLE_HELP_TEXT)}
        {inviteLinkEnabled === true ? (
          <span
            sx={{
              marginTop: "12px",
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CopyButton
              mood="neutral"
              intensity="supershy"
              iconProps={{
                color: "ds.text.neutral.standard",
              }}
              copyValue={inviteLink}
              data-testid="invite-link-copy-button"
            />
            <Paragraph as="span" textStyle="ds.body.reduced.link">
              {inviteLink}
            </Paragraph>
          </span>
        ) : null}
      </>
    ),
  };
  return <PolicySetting field={inviteLinkSwitch} />;
};
