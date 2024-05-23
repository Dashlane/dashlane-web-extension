import React, { lazy } from 'react';
import { PanelTransitionRoute, RoutesProps } from 'libs/router';
import { uuidRegex } from './common';
const NoteAddPanel = lazy(() => import('webapp/secure-notes/add/secure-notes-add').then((module) => ({
    default: module.NoteAddPanel,
})));
const NoteEditPanel = lazy(() => import('webapp/secure-notes/edit/secure-notes-edit').then((module) => ({
    default: module.NoteEditPanel,
})));
export const SecureNotePanelRoutes = ({ path }: RoutesProps) => (<>
    <PanelTransitionRoute path={`${path}*/secure-note(s?)/add`} component={NoteAddPanel}/>
    <PanelTransitionRoute path={`${path}*/secure-note(s?)/:uuid(${uuidRegex})`} component={NoteEditPanel}/>
  </>);
