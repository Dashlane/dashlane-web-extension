import { CheckIcon, colors, Eyebrow, Paragraph } from "@dashlane/ui-components";
import { Flex, Heading } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import * as React from "react";
const content = [
  "team_account_teamplan_changeplan_plans_team_security_dashboard",
  "team_account_teamplan_changeplan_plans_team_policy_management",
  "team_account_teamplan_changeplan_plans_team_advanced_reporting",
  "team_account_teamplan_changeplan_plans_team_group_sharing",
  "team_account_teamplan_changeplan_plans_team_active_directory_integration",
  "team_account_teamplan_changeplan_plans_team_dark_web_insights",
  "team_account_teamplan_changeplan_plans_team_vpn_via_hotspot_shield",
  "team_account_teamplan_changeplan_plans_team_audit_logs",
];
export const TeamCard = () => {
  const { translate } = useTranslate();
  return (
    <Flex
      flexDirection="column"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        height: "fit-content",
        minWidth: "223px",
        width: "fit-content",
        backgroundColor: colors.grey06,
        padding: "16px",
      }}
      role="contentinfo"
    >
      <Flex>
        <Flex
          sx={{
            borderRadius: "1px",
            border: `1px solid ${colors.midGreen03}`,
            padding: "1px",
            lineHeight: "10px",
          }}
        >
          <Eyebrow size="small">
            {translate("team_account_teamplan_changeplan_plans_plan_current")}
          </Eyebrow>
        </Flex>
      </Flex>
      <Heading as="h2" color="ds.text.neutral.quiet">
        {translate("team_account_teamplan_changeplan_plans_team_name")}
      </Heading>{" "}
      <hr
        style={{
          width: "100%",
          borderTop: `1px solid ${colors.grey02}`,
          borderBottom: "0",
          margin: "0",
        }}
      />
      <Flex flexDirection="column" gap="6px">
        {content.map((key) => (
          <Flex key={key} alignItems="center" gap="9px">
            <CheckIcon size={8} />
            <Paragraph color={colors.grey00} size="x-small">
              {translate(key)}
            </Paragraph>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
