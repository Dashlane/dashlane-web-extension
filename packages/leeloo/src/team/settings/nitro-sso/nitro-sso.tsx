import { confidentialSSOApi } from "@dashlane/sso-scim-contracts";
import { useModuleQuery } from "@dashlane/framework-react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { Card, Flex, Heading, Paragraph } from "@dashlane/design-system";
import { PropsOf } from "@dashlane/ui-components";
import { SsoSetupStep } from "@dashlane/hermes";
import { redirect } from "../../../libs/router";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ResponsiveMainSecondaryLayout } from "../components/layout/responsive-main-secondary-layout";
import { logNitroSSOSetupStep } from "../sso-setup-logs";
import { PageContext, SsoInfobox } from "../scim-sso-infoboxes/sso-infobox";
import { IdPSettingsFields } from "./idp-settings-fields";
import { MetadataForm } from "./metadata-form";
import { EnableNitroSSO } from "./enable-nitro-sso";
import { DomainsTable } from "./domains-table";
import { InfoCard } from "../components/layout/info-card";
import { ExternalLink } from "../components/layout/external-link";
import { BackPageLayout } from "../components/layout/back-page-layout";
const I18N_VALUES = {
  CARD_1_HEADING: "Before you start",
  CARD_1_BODY_INTRO: "To set up SSO, you'll need:",
  CARD_1_BODY_POINTS: [
    "Access to your IdP and public DNS provider accounts",
    "A list of members to add to your SSO application",
    "IdP metadata",
    "Email domain",
  ],
  CARD_1_SUB_HEADING: "Need help?",
  CARD_1_SUB_BODY: "For help setting up SSO, contact our Customer Support.",
  CARD_2_HEADING: "After turning on SSO",
  CARD_2_BODY_FIRST:
    "After SSO is turned on, non-admin members are required to log in with SSO.",
  CARD_2_BODY_SECOND:
    "They must use the browser extension when using Dashlane on a computer. They can also log in with SSO on mobile.",
  CARD_2_BODY_THIRD:
    "Admins can't log in with SSO. They still need to enter their Master Password.",
};
const I18N_KEYS = {
  PAGE_TITLE: "sso_confidential_page_title",
};
const SUPPORT_EMAIL = "__REDACTED__";
const NitroSSOForm = () => {
  const { status: ssoStateStatus, data: ssoState } = useModuleQuery(
    confidentialSSOApi,
    "ssoProvisioning"
  );
  if (ssoStateStatus !== DataStatus.Success) {
    return null;
  }
  const isSsoUnused =
    ssoStateStatus === DataStatus.Success
      ? !(ssoState as any).enableSSO.ssoEnabled
      : null;
  return (
    <div>
      <Flex flexDirection="column" gap="32px" sx={{ flexGrow: 1 }}>
        {isSsoUnused ? <SsoInfobox pageContext={PageContext.Nitro} /> : null}
        <Card sx={{ padding: "32px" }}>
          <IdPSettingsFields />
          <MetadataForm />
        </Card>
        <Card sx={{ padding: "32px" }}>
          <DomainsTable />
        </Card>
        <Card sx={{ padding: "32px" }}>
          <EnableNitroSSO />
        </Card>
      </Flex>
    </div>
  );
};
const NitroSSOInfo = (params: PropsOf<typeof Flex>) => {
  return (
    <div
      sx={{
        border: "none",
        display: "flex",
        gap: "24px",
        flexDirection: "column",
      }}
      {...params}
    >
      <InfoCard>
        <Heading as="h3" textStyle="ds.title.block.medium">
          {I18N_VALUES.CARD_1_HEADING}
        </Heading>
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.quiet"
        >
          {I18N_VALUES.CARD_1_BODY_INTRO}
        </Paragraph>
        <Paragraph
          as="ul"
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.quiet"
          sx={{
            margin: "0px 0px 8px 20px",
            listStyleType: "disc",
          }}
        >
          {I18N_VALUES.CARD_1_BODY_POINTS.map((string) => (
            <li key={string}>{string}</li>
          ))}
        </Paragraph>
        <Heading as="h3" textStyle="ds.title.block.medium">
          {I18N_VALUES.CARD_1_SUB_HEADING}
        </Heading>
        <Paragraph
          textStyle="ds.body.standard.regular"
          color="ds.text.neutral.quiet"
        >
          {I18N_VALUES.CARD_1_SUB_BODY}
        </Paragraph>
        <ExternalLink
          href={`mailto:${SUPPORT_EMAIL}`}
          sx={{ fontSize: "14px" }}
        >
          {SUPPORT_EMAIL}
        </ExternalLink>
      </InfoCard>
      <InfoCard>
        <Heading as="h3" textStyle="ds.title.block.medium">
          {I18N_VALUES.CARD_2_HEADING}
        </Heading>
        <Paragraph
          textStyle="ds.title.block.small"
          color="ds.text.neutral.quiet"
        >
          {I18N_VALUES.CARD_2_BODY_FIRST}
        </Paragraph>
        <Paragraph
          textStyle="ds.title.block.small"
          color="ds.text.neutral.quiet"
        >
          {I18N_VALUES.CARD_2_BODY_SECOND}
        </Paragraph>
        <Paragraph
          textStyle="ds.title.block.small"
          color="ds.text.danger.standard"
        >
          {I18N_VALUES.CARD_2_BODY_THIRD}
        </Paragraph>
      </InfoCard>
    </div>
  );
};
export const NitroSSO = ({ backRoute }: { backRoute: string }) => {
  const { data } = useModuleQuery(confidentialSSOApi, "ssoProvisioning");
  const { translate } = useTranslate();
  const showBackButton = !data?.enableSSO.ssoEnabled;
  const onBackClicked = () => {
    logNitroSSOSetupStep({
      ssoSetupStep: SsoSetupStep.ReturnToSsoSelection,
    });
    redirect(backRoute);
  };
  return (
    <BackPageLayout
      title={translate(I18N_KEYS.PAGE_TITLE)}
      showBackButton={showBackButton}
      onBackClicked={onBackClicked}
    >
      <ResponsiveMainSecondaryLayout
        mainContent={<NitroSSOForm />}
        secondaryContent={<NitroSSOInfo />}
      />
    </BackPageLayout>
  );
};
