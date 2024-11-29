import { z } from "zod";
import { useEffect, useState } from "react";
import {
  Heading,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import {
  PageView,
  ScimSetupStep,
  UserSetupConfidentialScimEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent, logPageView } from "../../../../libs/logs/logEvent";
import {
  ProvisioningSolution,
  SsoSolution,
  SsoStatus,
} from "@dashlane/sso-scim-contracts";
import { ExternalLink } from "../../components/layout/external-link";
import { GridContainer } from "@dashlane/ui-components";
import { FeatureCard } from "../../components/feature-card";
import {
  activeDirectory,
  confidentialSCIM,
  selfhostedlSCIM,
} from "./card-info";
import { useTeamCapabilities } from "../../hooks/use-team-capabilities";
import { SCIMPaywall } from "../scim-provisioning/scim-paywall";
import { useBuyOrUpgradePaywallDetails } from "../../../helpers/use-buy-or-upgrade-paywall-details";
import { DirectorySyncDisabledInfobox } from "./directory-sync-disabled-infobox";
import {
  useHistory,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
import { useIsStandard } from "../../../helpers/use-is-standard";
import { ContactUsSideContent } from "../../scim-sso-infoboxes/contact-us-side-item-sso-scim-card";
import { ContactSupportDialog } from "../../../page/support/contact-support-dialog";
const SETUP_GUIDE_HREF = "__REDACTED__";
const I18N_KEYS = {
  HEADER: "tac_settings_directory_sync_header",
  HEADER_HELPER: "tac_settings_directory_sync_header_helper",
  HEADER_HELPER_STANDARD:
    "tac_settings_directory_sync_entrylevel_header_helper",
  HEADER_LINK: "tac_settings_directory_sync_header_link",
  SCIM_CARD_BUTTON_SETUP: "tac_settings_directory_sync_card_button_setup",
  SCIM_CARD_BUTTON_EDIT: "tac_settings_directory_sync_card_button_edit",
  UPGRADE_TO_BUSINESS: "team_upgrade_to_business",
};
interface DirectorySyncLandingPageProps {
  ssoSolution: z.infer<typeof SsoSolution>;
  ssoStatus: z.infer<typeof SsoStatus>;
  provisioningSolution: z.infer<typeof ProvisioningSolution>;
  isLoading?: boolean;
}
export enum CtaDataTestIdEnum {
  ConfidentialScim = "confidential-scim-cta",
  SelfhostedScim = "selfhosted-scim-cta",
  AdSyncScim = "adsync-scim-cta",
}
export const DirectorySyncLandingPage = ({
  ssoSolution,
  ssoStatus,
  provisioningSolution,
  isLoading = false,
}: DirectorySyncLandingPageProps) => {
  const { translate } = useTranslate();
  const teamCapabilities = useTeamCapabilities();
  const isCapable = !!teamCapabilities?.scim.enabled;
  const paywallInfo = useBuyOrUpgradePaywallDetails({
    hasBillingAccess: true,
  });
  const isTrialOrGracePeriod = !!paywallInfo?.isTrialOrGracePeriod;
  const history = useHistory();
  const { routes } = useRouterGlobalSettingsContext();
  const isStandardPlan = useIsStandard();
  const [supportDialogIsOpen, setSupportDialogIsOpen] = useState(false);
  const upgradeToBusiness = () => {
    history.push(`${routes.teamAccountChangePlanRoutePath}?plan=business`);
  };
  const isProvisioningEnabled =
    provisioningSolution !== ProvisioningSolution.enum.none;
  const isSSOConnectorSetup = ssoSolution === SsoSolution.enum.ssoConnector;
  const headerHelperText = isStandardPlan
    ? I18N_KEYS.HEADER_HELPER_STANDARD
    : I18N_KEYS.HEADER_HELPER;
  useEffect(() => {
    logPageView(PageView.TacSettingsDirectorySync);
  }, []);
  if (isLoading || teamCapabilities === null || paywallInfo === null) {
    return (
      <GridContainer justifyItems="center">
        <IndeterminateLoader size={75} sx={{ marginTop: "20vh" }} />
      </GridContainer>
    );
  }
  return (
    <div
      sx={{
        margin: "32px",
        display: "flex",
        gap: "32px",
        flexDirection: "column",
      }}
    >
      <div>
        <Heading
          as="h1"
          textStyle="ds.title.section.large"
          sx={{ marginBottom: "16px" }}
        >
          {translate(I18N_KEYS.HEADER)}
        </Heading>
        <Paragraph sx={{ marginBottom: "8px" }}>
          {translate(headerHelperText)}
        </Paragraph>
        <ExternalLink href={SETUP_GUIDE_HREF}>
          {translate(I18N_KEYS.HEADER_LINK)}
        </ExternalLink>
      </div>
      {!isProvisioningEnabled && !isSSOConnectorSetup && !isStandardPlan ? (
        <DirectorySyncDisabledInfobox
          isNitroSSOActivated={
            ssoSolution === SsoSolution.enum.confidentialSaml &&
            ssoStatus === SsoStatus.enum.enabled
          }
          isSelfhostedSSOActivated={
            ssoSolution === SsoSolution.enum.selfHostedSaml &&
            ssoStatus === SsoStatus.enum.enabled
          }
        />
      ) : null}
      {isStandardPlan ? (
        <GridContainer fullWidth gridTemplateColumns="1fr 1fr 0.5fr" gap="24px">
          <FeatureCard
            setBusinessPlanBadge={true}
            {...activeDirectory}
            selected={provisioningSolution === ProvisioningSolution.enum.adSync}
            featureCardStatus={"NOT_STARTED"}
            buttonLabel={translate(I18N_KEYS.UPGRADE_TO_BUSINESS)}
            onCtaClick={upgradeToBusiness}
          />
          <SCIMPaywall isTrialOrGracePeriod={isTrialOrGracePeriod} />
          <div sx={{ height: "252px" }}>
            <ContactUsSideContent
              openContactDialog={() => setSupportDialogIsOpen(true)}
            />
          </div>
          {supportDialogIsOpen ? (
            <ContactSupportDialog
              onDismiss={() => setSupportDialogIsOpen(false)}
            />
          ) : null}
        </GridContainer>
      ) : (
        <GridContainer
          fullWidth
          gridTemplateColumns="repeat(3, 1fr)"
          gap="24px"
        >
          {isCapable ? (
            <>
              <FeatureCard
                optionNumber={1}
                {...confidentialSCIM}
                selected={
                  provisioningSolution ===
                  ProvisioningSolution.enum.confidentialScim
                }
                buttonLabel={translate(
                  provisioningSolution ===
                    ProvisioningSolution.enum.confidentialScim
                    ? I18N_KEYS.SCIM_CARD_BUTTON_EDIT
                    : I18N_KEYS.SCIM_CARD_BUTTON_SETUP
                )}
                disabled={
                  !(
                    ssoSolution === SsoSolution.enum.confidentialSaml &&
                    ssoStatus === SsoStatus.enum.enabled
                  ) ||
                  provisioningSolution ===
                    ProvisioningSolution.enum.selfHostedScim ||
                  provisioningSolution === ProvisioningSolution.enum.adSync
                }
                featureCardStatus={
                  provisioningSolution ===
                  ProvisioningSolution.enum.confidentialScim
                    ? "ACTIVATED"
                    : "NOT_STARTED"
                }
                onCtaClick={() => {
                  logEvent(
                    new UserSetupConfidentialScimEvent({
                      scimSetupStep: ScimSetupStep.ClickSetUp,
                    })
                  );
                }}
                ctaDataTestId={CtaDataTestIdEnum.ConfidentialScim}
              />
              <FeatureCard
                optionNumber={2}
                {...selfhostedlSCIM}
                selected={
                  provisioningSolution ===
                  ProvisioningSolution.enum.selfHostedScim
                }
                buttonLabel={translate(
                  provisioningSolution ===
                    ProvisioningSolution.enum.selfHostedScim
                    ? I18N_KEYS.SCIM_CARD_BUTTON_EDIT
                    : I18N_KEYS.SCIM_CARD_BUTTON_SETUP
                )}
                featureCardStatus={
                  provisioningSolution ===
                  ProvisioningSolution.enum.selfHostedScim
                    ? "ACTIVATED"
                    : "NOT_STARTED"
                }
                disabled={
                  ssoSolution === SsoSolution.enum.confidentialSaml ||
                  ssoSolution === SsoSolution.enum.ssoConnector ||
                  provisioningSolution ===
                    ProvisioningSolution.enum.confidentialScim ||
                  provisioningSolution === ProvisioningSolution.enum.adSync
                }
                ctaDataTestId={CtaDataTestIdEnum.SelfhostedScim}
              />
              <FeatureCard
                optionNumber={3}
                {...activeDirectory}
                selected={
                  provisioningSolution === ProvisioningSolution.enum.adSync
                }
                featureCardStatus={
                  provisioningSolution === ProvisioningSolution.enum.adSync
                    ? "ACTIVATED"
                    : "NOT_STARTED"
                }
                buttonLabel={translate(
                  provisioningSolution === ProvisioningSolution.enum.adSync
                    ? I18N_KEYS.SCIM_CARD_BUTTON_EDIT
                    : I18N_KEYS.SCIM_CARD_BUTTON_SETUP
                )}
                disabled={
                  provisioningSolution ===
                    ProvisioningSolution.enum.confidentialScim ||
                  provisioningSolution ===
                    ProvisioningSolution.enum.selfHostedScim
                }
                ctaDataTestId={CtaDataTestIdEnum.AdSyncScim}
              />
            </>
          ) : (
            <>
              <FeatureCard
                optionNumber={1}
                {...activeDirectory}
                selected={
                  provisioningSolution === ProvisioningSolution.enum.adSync
                }
                featureCardStatus={
                  provisioningSolution === ProvisioningSolution.enum.adSync
                    ? "ACTIVATED"
                    : "NOT_STARTED"
                }
                buttonLabel={translate(
                  provisioningSolution === ProvisioningSolution.enum.adSync
                    ? I18N_KEYS.SCIM_CARD_BUTTON_EDIT
                    : I18N_KEYS.SCIM_CARD_BUTTON_SETUP
                )}
                disabled={
                  provisioningSolution ===
                    ProvisioningSolution.enum.confidentialScim ||
                  provisioningSolution ===
                    ProvisioningSolution.enum.selfHostedScim
                }
                ctaDataTestId="adsync-scim-cta"
              />
              <SCIMPaywall isTrialOrGracePeriod={isTrialOrGracePeriod} />
            </>
          )}
        </GridContainer>
      )}
    </div>
  );
};
