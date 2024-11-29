import { useCallback, useEffect, useMemo } from "react";
import { Heading, ThemeUIStyleObject } from "@dashlane/design-system";
import { BreachItemView, BreachStatus } from "@dashlane/communication";
import { PageView } from "@dashlane/hermes";
import { DataLeaksEmail } from "@dashlane/password-security-contracts";
import { PrivateBreachRow } from "./private-breach-row/private-breach-row";
import { useBreachDetailsDialog } from "../breach-details/use-breach-details-dialog";
import { EmptyBreaches } from "./empty-breaches/empty-breaches";
import useTranslate from "../../../libs/i18n/useTranslate";
import { InjectedProps as PaginationProps } from "../../../libs/pagination/consumer";
import { InfiniteScroll } from "../../../libs/pagination/infinite-scroll";
import { logPageView } from "../../../libs/logs/logEvent";
import { LeakedMasterPasswordInfobox } from "../leaked-master-password/leaked-master-password-infobox";
import { useBreaches } from "../hooks/useBreaches";
const I18N_KEYS = {
  MONITORED_BREACHES: "webapp_darkweb_leaks_monitored_leaks_title",
};
const PrivateBreachesComponentStyles: Record<string, ThemeUIStyleObject> = {
  listContainer: {
    height: "100%",
    backgroundColor: "ds.container.agnostic.neutral.supershy",
  },
  monitoredLeaks: {
    backgroundColor: "ds.container.agnostic.neutral.supershy",
    border: "1px solid ds.border.neutral.quiet.idle",
    borderRadius: "4px",
    padding: "32px",
    display: "flex",
    flex: "1 1 auto",
    flexDirection: "column",
  },
};
export interface PrivateBreachesBaseProps {
  hasDataLeakCapability: boolean;
  emails: null | DataLeaksEmail[];
  availableEmailSpots: number;
  onOpenAddDialog: () => void;
  premiumUrl: string;
}
export type PrivateBreachesProps = PaginationProps<BreachItemView> &
  PrivateBreachesBaseProps;
export const PrivateBreachesComponent = ({
  hasDataLeakCapability,
  hasNext,
  hasPrevious,
  isLoading,
  loadNext,
  loadPrevious,
  paginatedData,
  emails,
  availableEmailSpots,
  onOpenAddDialog,
  premiumUrl,
}: PrivateBreachesProps) => {
  const { translate } = useTranslate();
  const { markBreachAsSeen } = useBreaches();
  const { openBreachDetailsDialog } = useBreachDetailsDialog();
  const breachesPages: BreachItemView[][] = useMemo(
    () => [...paginatedData.values()],
    [paginatedData]
  );
  const onOpen = useCallback(
    (breach: BreachItemView) => {
      if (breach.status === BreachStatus.PENDING) {
        void markBreachAsSeen(breach.id);
      }
      openBreachDetailsDialog({ breach: breach.id });
    },
    [markBreachAsSeen, openBreachDetailsDialog]
  );
  useEffect(() => {
    logPageView(PageView.ToolsDarkWebMonitoringList);
  }, []);
  const renderBatch = useCallback(
    (breaches: BreachItemView[]) => {
      return breaches.map((breach) => (
        <PrivateBreachRow
          key={breach.id}
          breachItemView={breach}
          handleOnViewDetails={onOpen}
        />
      ));
    },
    [onOpen]
  );
  const renderEmptyLeaks = () => {
    return (
      <EmptyBreaches
        hasDataLeakCapability={hasDataLeakCapability}
        availableEmailSpots={availableEmailSpots}
        emails={emails}
        onOpenAddDialog={onOpenAddDialog}
        premiumUrl={premiumUrl}
      />
    );
  };
  const renderLeaks = () => {
    const hasLeaks = breachesPages.some((page) => page.length > 0);
    return (
      <InfiniteScroll
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        isLoading={isLoading}
        loadNext={loadNext}
        loadPrevious={loadPrevious}
      >
        <div sx={PrivateBreachesComponentStyles.listContainer}>
          {!hasLeaks ? renderEmptyLeaks() : breachesPages.map(renderBatch)}
        </div>
      </InfiniteScroll>
    );
  };
  return (
    <section sx={PrivateBreachesComponentStyles.monitoredLeaks}>
      <Heading
        as="h2"
        textStyle="ds.title.supporting.small"
        color="ds.text.neutral.quiet"
        sx={{ marginBottom: "8px" }}
      >
        {translate(I18N_KEYS.MONITORED_BREACHES)}
      </Heading>
      <LeakedMasterPasswordInfobox />
      {renderLeaks()}
    </section>
  );
};
