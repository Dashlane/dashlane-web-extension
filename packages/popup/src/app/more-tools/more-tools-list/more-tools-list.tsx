import { memo } from "react";
import { Flex, jsx } from "@dashlane/design-system";
import {
  ComputerIcon,
  HelpIcon,
  ShareIcon,
  TacIcon,
} from "@dashlane/ui-components";
import {
  HelpCenterArticleCta,
  UserOpenHelpCenterEvent,
} from "@dashlane/hermes";
import { I18N_KEYS } from "../more-tools";
import { logEvent } from "../../../libs/logs/logEvent";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useHasTacAccess } from "../../../libs/hooks/use-has-tac-access";
import { useIsBusinessAdmin } from "../../../libs/hooks/use-is-business-admin";
import * as moreToolsHelpers from "../helpers";
import { MoreToolsListItemClickable } from "./more-tools-list-item/more-tools-list-item-clickable";
import { DiscontinuationItem } from "./trial-item/discontinuation-item";
import { TrialWarningItem } from "./trial-item/trial-warning-item";
import { GracePeriodWarningItem } from "./trial-item/grace-period-item";
import { openWebAppReferralPage } from "../helpers";
import { B2CFrozenItem } from "./frozen-item/b2c-frozen-state-item";
const ReferralListItem = () => {
  const { translate } = useTranslate();
  const handleWebAppReferralClick = () => {
    void openWebAppReferralPage();
  };
  return (
    <MoreToolsListItemClickable
      icon={<ShareIcon color="ds.text.neutral.catchy" />}
      onClick={handleWebAppReferralClick}
      title={translate(I18N_KEYS.REFER_A_FRIEND.TITLE)}
      explanation={translate(I18N_KEYS.REFER_A_FRIEND.EXPLANATION)}
    />
  );
};
const MoreToolsListComponent = () => {
  const { translate } = useTranslate();
  const hasTacAccess = useHasTacAccess();
  const isAdmin = useIsBusinessAdmin();
  const handleOpenApp = () => {
    void moreToolsHelpers.openWebapp();
  };
  const handleOpenTeamConsole = () => {
    void moreToolsHelpers.openTeamConsole();
  };
  const handleOpenSupportLink = () => {
    void logEvent(
      new UserOpenHelpCenterEvent({
        helpCenterArticleCta: HelpCenterArticleCta.GoToDashlaneSupport,
      })
    );
    void moreToolsHelpers.openSupportLink();
  };
  return (
    <Flex
      as="ul"
      flexDirection="column"
      gap="8px"
      flexWrap="nowrap"
      sx={{
        border: "1px solid transparent",
        borderColor: "ds.border.neutral.quiet.idle",
        padding: "8px",
        borderRadius: "8px",
        backgroundColor: "ds.container.agnostic.neutral.supershy",
        boxSizing: "border-box",
      }}
    >
      {isAdmin ? <GracePeriodWarningItem /> : null}
      {isAdmin ? <TrialWarningItem /> : null}
      {isAdmin ? <DiscontinuationItem /> : null}
      <B2CFrozenItem />
      <MoreToolsListItemClickable
        icon={<ComputerIcon color="ds.text.neutral.catchy" />}
        onClick={handleOpenApp}
        title={translate(I18N_KEYS.OPEN_APP.TITLE)}
        explanation={translate(I18N_KEYS.OPEN_APP.EXPLANATION)}
      />
      {hasTacAccess ? (
        <MoreToolsListItemClickable
          icon={<TacIcon color="ds.text.neutral.catchy" />}
          onClick={handleOpenTeamConsole}
          title={translate(I18N_KEYS.OPEN_TEAM_CONSOLE.TITLE)}
          explanation={translate(I18N_KEYS.OPEN_TEAM_CONSOLE.EXPLANATION)}
        />
      ) : null}
      <ReferralListItem />
      <MoreToolsListItemClickable
        icon={<HelpIcon color="ds.text.neutral.catchy" />}
        onClick={handleOpenSupportLink}
        title={translate(I18N_KEYS.DASHLANE_SUPPORT.TITLE)}
        explanation={translate(I18N_KEYS.DASHLANE_SUPPORT.EXPLANATION)}
      />
    </Flex>
  );
};
export const MoreToolsList = memo(MoreToolsListComponent);
