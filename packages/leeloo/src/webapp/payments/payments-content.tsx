import { useEffect } from "react";
import { Icon, Paragraph } from "@dashlane/design-system";
import { PageView } from "@dashlane/hermes";
import {
  DataStatus,
  useFeatureFlip,
  useModuleQuery,
} from "@dashlane/framework-react";
import { vaultItemsCrudApi, VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../libs/i18n/useTranslate";
import { logPageView } from "../../libs/logs/logEvent";
import { useRouterGlobalSettingsContext } from "../../libs/router/RouterGlobalSettingsProvider";
import { EmptyView } from "../empty-view/empty-view";
import { BankAccountsListView } from "./bank-accounts/list/bank-accounts-list-view";
import { PaymentCardsGridView } from "./payment-cards/grid/payment-cards-grid-view";
import { useTeamSpaceContext } from "../../team/settings/components/TeamSpaceContext";
import { PaymentsHeader } from "./payments-header";
import { BaseLayout } from "../layout/base-layout";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { EmptyStateHeader } from "../empty-state/shared/empty-state-header";
import { PaymentsEmptyState } from "./empty-state/payments-empty-state";
const I18N_KEYS = {
  PAYMENT_CARD: "payments_grid_category_payment_card",
  BANK_ACCOUNT: "payments_grid_category_bank_account",
  EMPTY_TITLE: "webapp_payment_empty_view_title",
  EMPTY_DESCRIPTION: "webapp_payment_empty_view_description",
  EMPTY_STATE_PAGE_TITLE: "webapp_payments_empty_state_page_title",
};
const PaymentsEmptyView = () => {
  const { translate } = useTranslate();
  return (
    <EmptyView
      icon={
        <Icon
          name="ItemPaymentOutlined"
          color="ds.text.neutral.standard"
          sx={{ width: "64px", minWidth: "64px", height: "64px" }}
        />
      }
      title={translate(I18N_KEYS.EMPTY_TITLE)}
    >
      <Paragraph color="ds.text.neutral.standard">
        {translate(I18N_KEYS.EMPTY_DESCRIPTION)}
      </Paragraph>
    </EmptyView>
  );
};
export const PaymentsContent = () => {
  const { routes } = useRouterGlobalSettingsContext();
  const emptyStateBatch1FeatureFlip = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.EmptyStateBatch1
  );
  useEffect(() => {
    logPageView(PageView.ItemPaymentList);
  }, []);
  const { currentSpaceId } = useTeamSpaceContext();
  const { status, data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.BankAccount, VaultItemType.PaymentCard],
    propertyFilters:
      currentSpaceId !== null
        ? [
            {
              property: "spaceId",
              value: currentSpaceId,
            },
          ]
        : undefined,
    propertySorting: {
      property: "creationDatetime",
    },
  });
  if (
    status !== DataStatus.Success ||
    !Object.values(data).some((idDataResult) => idDataResult.matchCount > 0)
  ) {
    return (
      <BaseLayout
        header={
          emptyStateBatch1FeatureFlip ? (
            <EmptyStateHeader title={I18N_KEYS.EMPTY_STATE_PAGE_TITLE} />
          ) : (
            <PaymentsHeader />
          )
        }
      >
        {emptyStateBatch1FeatureFlip ? (
          <PaymentsEmptyState />
        ) : (
          <PaymentsEmptyView />
        )}
      </BaseLayout>
    );
  }
  const { bankAccountsResult, paymentCardsResult } = data;
  return (
    <BaseLayout header={<PaymentsHeader />}>
      {paymentCardsResult.matchCount > 0 ? (
        <PaymentCardsGridView
          paymentCardsResult={paymentCardsResult}
          cardRoute={routes.userPaymentCard}
        />
      ) : null}
      {bankAccountsResult.matchCount > 0 ? (
        <BankAccountsListView bankAccountsResult={bankAccountsResult} />
      ) : null}
    </BaseLayout>
  );
};
