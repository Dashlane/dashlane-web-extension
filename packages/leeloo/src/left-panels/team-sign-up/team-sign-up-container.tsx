import { Flex } from "@dashlane/design-system";
import { Heading, Paragraph } from "@dashlane/ui-components";
import { DataStatus } from "@dashlane/framework-react";
import useTranslate from "../../libs/i18n/useTranslate";
import { useLocation } from "../../libs/router";
import { BasePanelContainer } from "../base-panel-container";
import queryString from "query-string";
import { useTeamSignupInviteLink } from "../../account-creation/hooks/use-team-signup-invite-link";
const I18N_KEYS = {
  TITLE_NO_COMPANY: "webapp_auth_panel_tsup_generic",
  TITLE_COMPANY: "webapp_auth_panel_tsup_company_markup",
  SUBTITLE: "webapp_auth_panel_tsup_subtitle",
};
export const TeamSignUpContainer = () => {
  const { translate } = useTranslate();
  const { search } = useLocation();
  const queryParams = queryString.parse(search);
  const prefilledTeamKey = queryParams.team ?? "";
  const teamInviteLinkData = useTeamSignupInviteLink(prefilledTeamKey);
  const displayTeamName =
    teamInviteLinkData.status === DataStatus.Success &&
    teamInviteLinkData.login;
  return (
    <BasePanelContainer>
      <div
        sx={{
          paddingLeft: "80px",
          paddingRight: "80px",
          width: "100%",
        }}
      >
        <Flex
          gap={4}
          sx={{
            paddingTop: "240px",
            maxWidth: "66%",
            minWidth: "320px",
          }}
        >
          <Heading
            color="ds.text.neutral.catchy"
            size="large"
            sx={{
              textTransform: "uppercase",
              em: { color: "ds.text.brand.standard", fontStyle: "inherit" },
            }}
          >
            {displayTeamName ? (
              <div>
                {translate.markup(I18N_KEYS.TITLE_COMPANY, {
                  companyName: `*${displayTeamName}*`,
                })}
              </div>
            ) : (
              <div>{translate(I18N_KEYS.TITLE_NO_COMPANY)}</div>
            )}
          </Heading>
          <Paragraph color="ds.text.neutral.quiet" size="large">
            {translate(I18N_KEYS.SUBTITLE)}
          </Paragraph>
        </Flex>
      </div>
    </BasePanelContainer>
  );
};
