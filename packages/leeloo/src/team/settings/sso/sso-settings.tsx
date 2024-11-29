import React, { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSection,
  AccordionSummary,
  InfoBox,
} from "@dashlane/ui-components";
import { Button, Heading } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import { getCurrentTeamId } from "../../../libs/carbon/spaces";
import LoadingSpinner from "../../../libs/dashlane-style/loading-spinner";
import { openUrl } from "../../../libs/external-urls";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logPageView } from "../../../libs/logs/logEvent";
import { DomainContainer } from "./domain/domain-container";
import { EnableSsoStep } from "./enable-sso-step/enable-sso-container";
import { ConfigureIDP } from "./configure-idp/configure-idp";
import Row from "../base-page/row";
import { RowGroup } from "../base-page/row-group";
import SSOConnector from "./sso-connector/sso-connector";
import styles from "./styles.css";
import { DASHLANE_SUPPORT, SSO_SETUP_GUIDE } from "../../urls";
import {
  SettingAccordionSections,
  SSOSettingProps,
  SSOSettingStep,
} from "./types";
import { useTeamSettings } from "../hooks/useTeamSettings";
const I18N_KEYS = {
  PAGE_TITLE: "team_settings_menu_title_single_sign_on",
  TITLE: "team_settings_sso_title",
  SETUP_GUIDE_TITLE: "team_settings_sso_guide_title",
  SETUP_GUIDE_DESCRIPTION: "team_settings_sso_guide_description",
  SETUP_GUIDE_BUTTON: "team_settings_sso_setup_button",
  SSO_CONNECTOR: "team_settings_sso_connector_title",
  IDENTITY_PROVIDER: "team_settings_sso_identity_provider_title",
  ENABLE_SSO: "team_settings_sso_enable_title",
  INFOBOX_WARNING: "team_settings_sso_infobox_warning_markup",
  INFOBOX_TEAM_TIER_WARNING:
    "team_settings_sso_teamplan_infobox_warning_markup",
  INFOBOX_TEAM_TIER_WARNING_BUTTON:
    "team_settings_sso_teamplan_infobox_warning_button",
  INFOBOX_BUSINESS_TIER_WARNING:
    "team_settings_sso_desktop_infobox_warning_markup",
};
export const SSOSettings = ({ lee }: SSOSettingProps) => {
  const { translate } = useTranslate();
  const [stepsCompleted, setStepsCompleted] = useState(
    new Set<SSOSettingStep>()
  );
  const [openSections, setOpenSections] = useState(
    new Set<SettingAccordionSections>()
  );
  const [lockedSections, setLockedSections] = useState(
    new Set([
      SettingAccordionSections.EnableSSO,
      SettingAccordionSections.SSOConnector,
    ])
  );
  useEffect(() => {
    logPageView(PageView.TacSettingsSsoLegacy);
  }, []);
  useEffect(() => {
    const newOpenSections = new Set<SettingAccordionSections>();
    const newLockedSections = new Set<SettingAccordionSections>([
      SettingAccordionSections.EnableSSO,
      SettingAccordionSections.ConfigureIDP,
      SettingAccordionSections.SSOConnector,
    ]);
    if (
      stepsCompleted.has(SSOSettingStep.ClaimDomain) &&
      stepsCompleted.has(SSOSettingStep.VerifyDomain)
    ) {
      newOpenSections.add(SettingAccordionSections.SSOConnector);
      newOpenSections.add(SettingAccordionSections.ConfigureIDP);
      newOpenSections.add(SettingAccordionSections.EnableSSO);
      newLockedSections.delete(SettingAccordionSections.SSOConnector);
      newLockedSections.delete(SettingAccordionSections.ConfigureIDP);
      newLockedSections.delete(SettingAccordionSections.EnableSSO);
    }
    if (stepsCompleted.has(SSOSettingStep.EnableSSO)) {
      newOpenSections.delete(SettingAccordionSections.SSOConnector);
      newOpenSections.delete(SettingAccordionSections.ConfigureIDP);
    }
    setOpenSections(newOpenSections);
    setLockedSections(newLockedSections);
  }, [stepsCompleted]);
  const completeStep = useCallback((step: SSOSettingStep) => {
    setStepsCompleted((prevSteps) => {
      const checkDependentStepsCompleted = (
        dependentSteps: SSOSettingStep[]
      ) => {
        return dependentSteps.every((step) => prevSteps.has(step));
      };
      let dependentStepsComplete = true;
      switch (step) {
        case SSOSettingStep.EnableSSO | SSOSettingStep.VerifyDomain:
          dependentStepsComplete = true;
          break;
        case SSOSettingStep.SSOConnector:
          dependentStepsComplete = checkDependentStepsCompleted([
            SSOSettingStep.ClaimDomain,
            SSOSettingStep.VerifyDomain,
          ]);
          break;
        case SSOSettingStep.EnableSSO:
          dependentStepsComplete = checkDependentStepsCompleted([
            SSOSettingStep.ClaimDomain,
            SSOSettingStep.VerifyDomain,
            SSOSettingStep.SSOConnector,
          ]);
          break;
      }
      if (dependentStepsComplete && !prevSteps.has(step)) {
        return new Set([...prevSteps, step]);
      } else {
        return prevSteps;
      }
    });
  }, []);
  const uncompleteSteps = useCallback((stepsToUncomplete: SSOSettingStep[]) => {
    setStepsCompleted((prevSteps) => {
      const removedSteps = new Set(prevSteps);
      stepsToUncomplete.forEach((step) => {
        removedSteps.delete(step);
      });
      return removedSteps;
    });
  }, []);
  const openHelpPage = (): void => {
    openUrl(SSO_SETUP_GUIDE);
  };
  const teamId = getCurrentTeamId(lee.globalState);
  const { teamSettingsLoading, teamSettings, updateTeamSettings, planTier } =
    useTeamSettings(teamId);
  const accordionSections = [
    {
      label: translate(I18N_KEYS.SSO_CONNECTOR),
      component: SSOConnector,
      locked: lockedSections.has(SettingAccordionSections.SSOConnector),
      open: openSections.has(SettingAccordionSections.SSOConnector),
      index: 2,
    },
    {
      label: translate(I18N_KEYS.IDENTITY_PROVIDER),
      component: ConfigureIDP,
      locked: lockedSections.has(SettingAccordionSections.ConfigureIDP),
      open: openSections.has(SettingAccordionSections.ConfigureIDP),
      index: 3,
    },
    {
      label: translate(I18N_KEYS.ENABLE_SSO),
      component: EnableSsoStep,
      locked: lockedSections.has(SettingAccordionSections.EnableSSO),
      open: openSections.has(SettingAccordionSections.EnableSSO),
      index: 4,
    },
  ];
  const accordion = (): React.ReactNode => {
    if (teamSettingsLoading) {
      return (
        <LoadingSpinner
          containerClassName={styles.loadingContainer}
          size={40}
        />
      );
    }
    return (
      <Accordion size="large">
        {accordionSections.map((section) => (
          <AccordionSection
            open={section.open}
            key={section.label}
            readOnly={section.locked}
          >
            <AccordionSummary>
              {`${section.index}. ${section.label}`}
            </AccordionSummary>
            <AccordionDetails>
              <fieldset disabled={section.locked}>
                <section.component
                  isTeamSettingsLoading={teamSettingsLoading}
                  teamSettings={teamSettings}
                  setStepComplete={completeStep}
                  updateTeamSettings={updateTeamSettings}
                  teamId={teamId ?? null}
                  planTier={planTier ?? null}
                />
              </fieldset>
            </AccordionDetails>
          </AccordionSection>
        ))}
      </Accordion>
    );
  };
  const displayInfoBoxWarning = () => {
    if (!teamSettings || teamSettings.ssoEnabled) {
      return null;
    }
    if (planTier === "team" || planTier === "legacy") {
      const infoBoxTitle = translate.markup(
        I18N_KEYS.INFOBOX_TEAM_TIER_WARNING
      );
      const primaryLabel = translate(
        I18N_KEYS.INFOBOX_TEAM_TIER_WARNING_BUTTON
      );
      return (
        <div className={styles.infoBox}>
          <InfoBox
            title={infoBoxTitle}
            size="simple"
            secondaryLabel={primaryLabel}
            secondary={() => openUrl(DASHLANE_SUPPORT)}
          />
        </div>
      );
    }
    return null;
  };
  return (
    <div
      sx={{
        minHeight: "100%",
        minWidth: "1116px",
        padding: "32px 48px",
      }}
    >
      <div
        sx={{
          display: "flex",
          flexDirection: "column",
          maxWidth: "74em",
        }}
      >
        <Heading
          as="h1"
          textStyle="ds.title.section.large"
          color="ds.text.neutral.catchy"
          sx={{ marginBottom: "32px" }}
        >
          {translate(I18N_KEYS.PAGE_TITLE)}
        </Heading>
        <div
          sx={{
            display: "inline-block",
            backgroundColor: "ds.container.agnostic.neutral.supershy",
            padding: "32px",
            marginBottom: "10px",
            flex: "1",
            borderRadius: "8px",
          }}
        >
          {displayInfoBoxWarning()}
          <RowGroup title={translate(I18N_KEYS.TITLE)}>
            <Row
              label={translate(I18N_KEYS.SETUP_GUIDE_TITLE)}
              labelHelper={translate(I18N_KEYS.SETUP_GUIDE_DESCRIPTION)}
            >
              <Button onClick={openHelpPage} mood="brand" intensity="catchy">
                {translate(I18N_KEYS.SETUP_GUIDE_BUTTON)}
              </Button>
            </Row>
            <DomainContainer
              isTeamSettingsLoading={teamSettingsLoading}
              teamSettings={teamSettings}
              setStepComplete={completeStep}
              uncompleteSteps={uncompleteSteps}
              updateTeamSettings={updateTeamSettings}
              teamId={teamId}
              planTier={planTier}
            />
          </RowGroup>
        </div>
        {accordion()}
      </div>
    </div>
  );
};
