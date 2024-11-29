import { useCallback, useEffect, useState } from "react";
import { Card, Heading } from "@dashlane/design-system";
import { GridChild, GridContainer } from "@dashlane/ui-components";
import { PageView } from "@dashlane/hermes";
import { GetDarkWebInsightsSummaryResponse } from "@dashlane/communication";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  GetReportQueryResult,
  teamPasswordHealthApi,
} from "@dashlane/team-admin-contracts";
import { carbonConnector } from "../../libs/carbon/connector";
import { logPageView } from "../../libs/logs/logEvent";
import useTranslate from "../../libs/i18n/useTranslate";
import {
  DomainVerificationStatus,
  useDomainVerification,
} from "../helpers/use-domain-verification";
import { Loader } from "../components/loader";
import { UpgradeTile, useShowUpgradeTile } from "../upgrade-tile/upgrade-tile";
import { CardsRow } from "./cards-row/CardsRow";
import { PasswordHealthCard } from "./password-health-card/PasswordHealthCard";
import { DWIGetStartedTile } from "./dwi-discovery-tile/DWIGetStartedTile";
import { DWICard, DWITile } from "./dwi-discovery-tile/DWITile";
import { ConsolePage } from "../page";
const DEFAULT_REPORT: GetReportQueryResult = {
  seats: {
    pending: 0,
    provisioned: 0,
    used: 0,
  },
  passwordHealthHistory: [],
  passwordHealth: {
    compromised: 0,
    passwords: 0,
    reused: 0,
    safe: 0,
    securityIndex: 0,
    weak: 0,
  },
};
export enum DiscontinuationModalState {
  PURCHASE,
  PAYMENT,
}
const I18N_KEY = {
  DASHBOARD_PAGE_TITLE: "dashboard_page_title",
};
export const Dashboard = () => {
  const { data, status: queryStatus } = useModuleQuery(
    teamPasswordHealthApi,
    "getReport"
  );
  const report = queryStatus === DataStatus.Success ? data : DEFAULT_REPORT;
  const isQueryLoading = queryStatus === DataStatus.Loading;
  const {
    verifiedOrPendingDomain: { domain, status: verificationStatus },
  } = useDomainVerification();
  const [dwiSummaryResponse, setDwiSummaryResponse] =
    useState<GetDarkWebInsightsSummaryResponse | null>(null);
  const passwordHealthHistoryEmpty =
    queryStatus === DataStatus.Success &&
    report.passwordHealthHistory.length === 0;
  const fetchDWISummary = useCallback(async () => {
    const result = await carbonConnector.getDarkWebInsightsSummary();
    setDwiSummaryResponse(result);
  }, []);
  useEffect(() => {
    logPageView(PageView.TacDashboard);
    fetchDWISummary();
  }, [fetchDWISummary]);
  const showUpgradeTile = useShowUpgradeTile({ dismissible: true });
  const { translate } = useTranslate();
  return (
    <ConsolePage
      header={
        <Heading
          as="h1"
          color="ds.text.neutral.standard"
          textStyle="ds.title.section.large"
        >
          {translate(I18N_KEY.DASHBOARD_PAGE_TITLE)}
        </Heading>
      }
    >
      <GridContainer
        fullWidth
        alignItems="top"
        gap="32px"
        gridTemplateColumns="710px auto"
        gridTemplateRows="auto auto"
        gridTemplateAreas={`'cards cards' '${
          showUpgradeTile ? "pwHealth upgrade" : "pwHealth dwi"
        }'`}
      >
        <GridChild gridArea="cards">
          <CardsRow
            passwordHealth={report.passwordHealth}
            seats={report.seats}
            passwordHealthHistoryEmpty={passwordHealthHistoryEmpty}
          />
        </GridChild>
        <GridChild
          gridArea="pwHealth"
          sx={{
            minHeight: "418px",
          }}
        >
          <PasswordHealthCard
            isLoading={isQueryLoading}
            report={report}
            passwordHealthHistoryEmpty={passwordHealthHistoryEmpty}
          />
        </GridChild>
        {showUpgradeTile ? (
          <GridChild gridArea="upgrade" sx={{ width: "282px" }}>
            <Card
              sx={{
                padding: "16px",
                backgroundColor: "ds.container.agnostic.neutral.supershy",
                borderColor: "ds.border.neutral.quiet.idle",
              }}
            >
              <UpgradeTile dismissible />
            </Card>
          </GridChild>
        ) : (
          <GridChild gridArea="dwi">
            {verificationStatus === DomainVerificationStatus.Loading ? (
              <DWICard />
            ) : domain !== null ? (
              <DWITile
                verifiedOrPendingDomain={domain}
                dwiSummaryResponse={dwiSummaryResponse}
              />
            ) : (
              <DWIGetStartedTile dwiSummaryResponse={dwiSummaryResponse} />
            )}
          </GridChild>
        )}
      </GridContainer>
      {isQueryLoading ? <Loader /> : null}
    </ConsolePage>
  );
};
