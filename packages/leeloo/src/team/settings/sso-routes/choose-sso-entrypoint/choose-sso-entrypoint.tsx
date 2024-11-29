import { useEffect, useState } from "react";
import { Icon, IndeterminateLoader, Paragraph } from "@dashlane/design-system";
import {
  DataStatus,
  useFeatureFlips,
  useModuleQuery,
} from "@dashlane/framework-react";
import {
  confidentialSSOApi,
  scimApi,
  SsoSolution,
  SsoStatus,
} from "@dashlane/sso-scim-contracts";
import { GridContainer } from "@dashlane/ui-components";
import { SsoSetupStep } from "@dashlane/hermes";
import { useTeamBillingInformation } from "../../../../libs/hooks/use-team-billing-information";
import { TabMenu } from "../../../page/tab-menu/tab-menu";
import {
  logNitroSSOSetupStep,
  logSelfHostedSSOSetupStep,
  logSSOLandingPageView,
} from "../../sso-setup-logs";
import {
  I18N_VALUES,
  LEARN_MORE_LINK,
  nitroSSO,
  selfHostedSSO,
  ssoConnectorFeatureCard,
} from "./text-content";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { FeatureCard } from "../../components/feature-card";
import { ContentError } from "../content-error";
import { MigrateToConfidential } from "../migrate-to-confidential";
const MainContent = () => {
  const { translate } = useTranslate();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const teamBillingInfo = useTeamBillingInformation();
  const featureflipsResult = useFeatureFlips();
  const nitroState = useModuleQuery(confidentialSSOApi, "ssoProvisioning");
  const confidentialScim = useModuleQuery(scimApi, "scimConfiguration");
  const extractFeatureFlips = (): Record<string, boolean> => {
    if (featureflipsResult.status !== DataStatus.Success) {
      return {};
    }
    const {
      itadmin_tac_encryptionservice_SSOmigration_reset,
      setup_rollout_web_ssoconnector_card,
      setup_rollout_confidential_migration,
    } = featureflipsResult.data;
    return {
      ssoMigrationFF: itadmin_tac_encryptionservice_SSOmigration_reset ?? false,
      ssoConnectorCardFF: setup_rollout_web_ssoconnector_card ?? false,
      confidentialSSOMigrationFF: setup_rollout_confidential_migration ?? false,
    };
  };
  useEffect(() => {
    logSSOLandingPageView();
  }, []);
  const { ssoMigrationFF, ssoConnectorCardFF, confidentialSSOMigrationFF } =
    extractFeatureFlips();
  useEffect(() => {
    if (
      featureflipsResult.status === DataStatus.Success &&
      teamBillingInfo &&
      nitroState.status === DataStatus.Success &&
      confidentialScim.status === DataStatus.Success
    ) {
      setIsLoading(false);
    }
  }, [
    teamBillingInfo,
    nitroState.status,
    confidentialScim.status,
    featureflipsResult,
  ]);
  if (isLoading) {
    return (
      <GridContainer justifyItems="center">
        <IndeterminateLoader size={75} sx={{ marginTop: "20vh" }} />
      </GridContainer>
    );
  }
  if (
    nitroState.status === DataStatus.Error ||
    confidentialScim.status === DataStatus.Error
  ) {
    return (
      <ContentError
        errorTag={nitroState.error?.tag ?? confidentialScim.error?.tag}
      />
    );
  }
  if (
    nitroState.status !== DataStatus.Success ||
    confidentialScim.status !== DataStatus.Success ||
    !teamBillingInfo
  ) {
    return null;
  }
  const {
    ssoSolution,
    ssoStatus,
    global: { ssoCapable },
  } = nitroState.data;
  const ctasDisabled = !ssoCapable;
  const isSelfHostedSSO = ssoSolution === SsoSolution.enum.selfHostedSaml;
  const isConfidentialSSO = ssoSolution === SsoSolution.enum.confidentialSaml;
  const isSSOConnector =
    ssoSolution === SsoSolution.enum.ssoConnector || ssoConnectorCardFF;
  const selfHostedCtaClicked = () => {
    logSelfHostedSSOSetupStep({
      currentBillingPlanTier: teamBillingInfo.spaceTier,
      ssoSetupStep: SsoSetupStep.ChooseYourSsoSolution,
    });
  };
  const nitroCtaClicked = () => {
    logNitroSSOSetupStep({
      currentBillingPlanTier: teamBillingInfo.spaceTier,
      ssoSetupStep: SsoSetupStep.ChooseYourSsoSolution,
    });
  };
  return (
    <GridContainer
      gap="16px"
      alignContent="start"
      sx={{ px: "48px", pt: "32px", pb: "12px" }}
    >
      <GridContainer
        fullWidth
        gap="24px"
        gridTemplateColumns={isSSOConnector ? "1fr 1fr 1fr" : "1fr 1fr"}
      >
        <FeatureCard
          selected={isConfidentialSSO}
          optionNumber={1}
          {...nitroSSO}
          buttonLabel={
            isConfidentialSSO
              ? translate(I18N_VALUES.NITRO_EDIT_BUTTON)
              : translate(I18N_VALUES.NITRO_SETUP_BUTTON)
          }
          disabled={
            ctasDisabled ||
            (ssoSolution === SsoSolution.enum.selfHostedSaml &&
              ssoStatus === SsoStatus.enum.enabled) ||
            isSSOConnector
          }
          featureCardStatus={
            ssoSolution === SsoSolution.enum.confidentialSaml &&
            ssoStatus === SsoStatus.enum.enabled
              ? "ACTIVATED"
              : ssoSolution === SsoSolution.enum.confidentialSaml &&
                ssoStatus === SsoStatus.enum.incomplete
              ? "STARTED"
              : "NOT_STARTED"
          }
          onCtaClick={nitroCtaClicked}
        />

        <FeatureCard
          optionNumber={2}
          {...selfHostedSSO}
          selected={isSelfHostedSSO}
          buttonLabel={
            isSelfHostedSSO
              ? translate(I18N_VALUES.SELF_HOSTED_EDIT_BUTTON)
              : translate(I18N_VALUES.SELF_HOSTED_SETUP_BUTTON)
          }
          disabled={
            ctasDisabled ||
            ssoSolution === SsoSolution.enum.confidentialSaml ||
            !!confidentialScim.data.token ||
            (isSSOConnector && !ssoMigrationFF)
          }
          featureCardStatus={
            ssoSolution === SsoSolution.enum.selfHostedSaml &&
            ssoStatus === SsoStatus.enum.enabled
              ? "ACTIVATED"
              : ssoSolution === SsoSolution.enum.selfHostedSaml &&
                ssoStatus === SsoStatus.enum.incomplete
              ? "STARTED"
              : "NOT_STARTED"
          }
          onCtaClick={selfHostedCtaClicked}
        />

        {isSSOConnector ? (
          <FeatureCard
            optionNumber={3}
            {...ssoConnectorFeatureCard}
            buttonLabel={translate(I18N_VALUES.SSO_CONNECTOR_EDIT_BUTTON)}
            disabled={isConfidentialSSO || isSelfHostedSSO}
            featureCardStatus="ACTIVATED"
          />
        ) : null}
      </GridContainer>

      {confidentialSSOMigrationFF ? (
        <MigrateToConfidential isSsoConnector={isSSOConnector} />
      ) : null}
    </GridContainer>
  );
};
export const ChooseSsoEntrypoint = () => {
  const { translate } = useTranslate();
  return (
    <GridContainer
      gridTemplateColumns="auto"
      gridTemplateRows="auto 1fr"
      fullWidth
      sx={{ height: "100%" }}
    >
      <GridContainer sx={{ px: "48px", pt: "32px", pb: "12px" }}>
        <TabMenu title={I18N_VALUES.PAGE_TITLE} />
        <Paragraph textStyle="ds.body.standard.regular">
          {translate(I18N_VALUES.CHOOSE_SSO_OPTION_DESCRIPTION)}
        </Paragraph>

        <div sx={{ display: "flex", alignItems: "center" }}>
          <Paragraph
            as="a"
            href={LEARN_MORE_LINK}
            textStyle="ds.body.standard.regular"
            color="ds.text.brand.quiet"
            sx={{
              padding: "5px 5px 5px 0px",
              gap: "4px",
            }}
          >
            {" "}
            {translate(I18N_VALUES.CHOOSE_SSO_LEARN_MORE_LINK)}
          </Paragraph>
          <Icon
            name="ActionOpenExternalLinkOutlined"
            size="small"
            color="ds.text.brand.quiet"
          />
        </div>
      </GridContainer>
      <MainContent />
    </GridContainer>
  );
};
