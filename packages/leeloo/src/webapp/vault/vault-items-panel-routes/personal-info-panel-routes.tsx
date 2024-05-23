import React, { lazy } from 'react';
import { PanelTransitionRoute, RoutesProps } from 'libs/router';
import { uuidRegex } from './common';
const AddressAddPanel = lazy(() => import('webapp/personal-info/address/add').then((module) => ({
    default: module.AddressAddPanel,
})));
const AddressEditPanel = lazy(() => import('webapp/personal-info/address/edit-connected').then((module) => ({
    default: module.Connected,
})));
const CompanyAddPanel = lazy(() => import('webapp/personal-info/company/add').then((module) => ({
    default: module.CompanyAddPanel,
})));
const CompanyEditPanel = lazy(() => import('webapp/personal-info/company/edit-connected').then((module) => ({
    default: module.Connected,
})));
const EmailAddPanel = lazy(() => import('webapp/personal-info/email/add').then((module) => ({
    default: module.EmailAddPanel,
})));
const EmailEditPanel = lazy(() => import('webapp/personal-info/email/edit-connected').then((module) => ({
    default: module.Connected,
})));
const IdentityAddPanel = lazy(() => import('webapp/personal-info/identity/add').then((module) => ({
    default: module.IdentityAddPanel,
})));
const IdentityEditPanel = lazy(() => import('webapp/personal-info/identity/edit-connected').then((module) => ({
    default: module.Connected,
})));
const PhoneAddPanel = lazy(() => import('webapp/personal-info/phone/add').then((module) => ({
    default: module.PhoneAddPanel,
})));
const PhoneEditPanel = lazy(() => import('webapp/personal-info/phone/edit-connected').then((module) => ({
    default: module.Connected,
})));
const WebsiteAddPanel = lazy(() => import('webapp/personal-info/website/add').then((module) => ({
    default: module.WebsiteAddPanel,
})));
const WebsiteEditPanel = lazy(() => import('webapp/personal-info/website/edit-connected').then((module) => ({
    default: module.Connected,
})));
export const PersonalInfoPanelRoutes = ({ path }: RoutesProps) => (<>
    <PanelTransitionRoute path={`${path}*/address(es?)/add`} component={AddressAddPanel}/>
    <PanelTransitionRoute path={`${path}*/address(es?)/:uuid(${uuidRegex})`} component={AddressEditPanel}/>
    <PanelTransitionRoute path={`${path}*/companies/add`} component={CompanyAddPanel}/>
    <PanelTransitionRoute path={`${path}*/companies/:uuid(${uuidRegex})`} component={CompanyEditPanel}/>
    <PanelTransitionRoute path={`${path}*/email(s?)/add`} component={EmailAddPanel}/>
    <PanelTransitionRoute path={`${path}*/email(s?)/:uuid(${uuidRegex})`} component={EmailEditPanel}/>
    <PanelTransitionRoute path={`${path}*/identities/add`} component={IdentityAddPanel}/>
    <PanelTransitionRoute path={`${path}*/identities/:uuid(${uuidRegex})`} component={IdentityEditPanel}/>
    <PanelTransitionRoute path={`${path}*/phone(s?)/add`} component={PhoneAddPanel}/>
    <PanelTransitionRoute path={`${path}*/phone(s?)/:uuid(${uuidRegex})`} component={PhoneEditPanel}/>
    <PanelTransitionRoute path={`${path}*/website(s?)/add`} component={WebsiteAddPanel}/>
    <PanelTransitionRoute path={`${path}*/website(s?)/:uuid(${uuidRegex})`} component={WebsiteEditPanel}/>
  </>);
