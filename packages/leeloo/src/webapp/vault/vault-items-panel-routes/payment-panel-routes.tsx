import React, { lazy } from 'react';
import { PanelTransitionRoute, RoutesProps } from 'libs/router';
import { uuidRegex } from './common';
const PaymentCardAddPanel = lazy(() => import('webapp/payments/payment-cards/add-panel').then((module) => ({
    default: module.PaymentCardAddPanel,
})));
const PaymentCardEditPanel = lazy(() => import('webapp/payments/payment-cards/edit-panel').then((module) => ({
    default: module.PaymentCardEditPanel,
})));
const BankAccountAddView = lazy(() => import('webapp/payments/bank-accounts/add/view').then((module) => ({
    default: module.BankAccountAddView,
})));
const BankAccountEditPanel = lazy(() => import('webapp/payments/bank-accounts/edit/connected').then((module) => ({
    default: module.Connected,
})));
export const PaymentPanelRoutes = ({ path }: RoutesProps) => (<>
    <PanelTransitionRoute path={`${path}*/card(s?)/add`} key="add-payment-card" component={PaymentCardAddPanel}/>
    <PanelTransitionRoute path={`${path}*/card(s?)/:uuid(${uuidRegex})`} component={PaymentCardEditPanel}/>
    <PanelTransitionRoute path={`${path}*/bank-account(s?)/add`} key="add-bank-account" component={BankAccountAddView}/>
    <PanelTransitionRoute path={`${path}*/bank-account(s?)/:uuid(${uuidRegex})`} component={BankAccountEditPanel}/>
  </>);
