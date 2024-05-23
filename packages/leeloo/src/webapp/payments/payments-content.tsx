import { Children, useEffect } from 'react';
import { Icon, jsx, Paragraph } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { vaultItemsCrudApi, VaultItemType } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { logPageView } from 'libs/logs/logEvent';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { EmptyView } from 'webapp/empty-view/empty-view';
import { BankAccountsListView } from 'webapp/payments/bank-accounts/list/bank-accounts-list-view';
import { PaymentCardsGridView } from 'webapp/payments/payment-cards/grid/payment-cards-grid-view';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
const I18N_KEYS = {
    PAYMENT_CARD: 'payments_grid_category_payment_card',
    BANK_ACCOUNT: 'payments_grid_category_bank_account',
    EMPTY_TITLE: 'webapp_payment_empty_view_title',
    EMPTY_DESCRIPTION: 'webapp_payment_empty_view_description',
};
const PaymentsEmptyView = () => {
    const { translate } = useTranslate();
    return (<EmptyView icon={<Icon name="ItemPaymentOutlined" color="ds.text.neutral.standard" sx={{ width: '64px', minWidth: '64px', height: '64px' }}/>} title={translate(I18N_KEYS.EMPTY_TITLE)}>
      <Paragraph color="ds.text.neutral.standard">
        {translate(I18N_KEYS.EMPTY_DESCRIPTION)}
      </Paragraph>
    </EmptyView>);
};
const Wrapper = (props: {
    children: React.ReactNode;
}) => {
    return (<div sx={{
            whiteSpace: 'nowrap',
            overflow: 'auto',
            height: 'calc(100% - 72px)',
            padding: '0 32px',
        }}>
      {Children.toArray(props.children)}
    </div>);
};
export const PaymentsContent = () => {
    const { routes } = useRouterGlobalSettingsContext();
    useEffect(() => {
        logPageView(PageView.ItemPaymentList);
    }, []);
    const { currentSpaceId } = useTeamSpaceContext();
    const { status, data } = useModuleQuery(vaultItemsCrudApi, 'query', {
        vaultItemTypes: [VaultItemType.BankAccount, VaultItemType.PaymentCard],
        propertyFilters: currentSpaceId !== null
            ? [
                {
                    property: 'spaceId',
                    value: currentSpaceId,
                },
            ]
            : undefined,
        propertySorting: {
            property: 'creationDatetime',
        },
    });
    if (status !== DataStatus.Success ||
        !Object.values(data).some((idDataResult) => idDataResult.matchCount > 0)) {
        return (<Wrapper>
        <PaymentsEmptyView />
      </Wrapper>);
    }
    const { bankAccountsResult, paymentCardsResult } = data;
    return (<Wrapper>
      {paymentCardsResult.matchCount > 0 ? (<PaymentCardsGridView paymentCardsResult={paymentCardsResult} cardRoute={routes.userPaymentCard}/>) : null}
      {bankAccountsResult.matchCount > 0 ? (<BankAccountsListView bankAccountsResult={bankAccountsResult}/>) : null}
    </Wrapper>);
};
