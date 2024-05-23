import React from 'react';
import { Diff } from 'utility-types';
import { ListResults, NoteCategoryDetailView, NoteDetailView, } from '@dashlane/communication';
import { PageView } from '@dashlane/hermes';
import { carbonConnector } from 'libs/carbon/connector';
import { connect, Selector } from 'libs/carbonApiConsumer';
import { logPageView } from 'libs/logs/logEvent';
import { remoteDataAdapter } from 'libs/remoteDataAdapter';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import { Props } from './secure-notes-edit-component';
import { SecureNotesEditGrapheneComponent } from './secore-notes-edit-graphene-component';
interface InjectedProps {
    note: NoteDetailView;
    noteCategories: ListResults<NoteCategoryDetailView>;
}
type WrapperProps = Diff<Props, InjectedProps>;
const param = (props: WrapperProps): string => {
    if (!props.match.params) {
        throw new Error('missing route `params`');
    }
    return `{${props.match.params.uuid}}`;
};
const noteSelector: Selector<NoteDetailView | undefined, WrapperProps, string> = {
    live: carbonConnector.liveNote,
    liveParam: param,
    query: carbonConnector.getNote,
    queryParam: param,
};
const notesCategoriesSelector: Selector<ListResults<NoteCategoryDetailView>, WrapperProps, void> = {
    query: carbonConnector.getNoteCategories,
};
const selectors = {
    note: noteSelector,
    noteCategories: notesCategoriesSelector,
};
const remoteDataConfig = {
    strategies: selectors,
};
const NoteEditComponent = (props: Props) => {
    const { note } = props;
    const { routes } = useRouterGlobalSettingsContext();
    const leaveIfItemWasDeleted = React.useCallback(() => {
        if (!note) {
            redirect(routes.userSecureNotes);
            return true;
        }
        return false;
    }, [note, routes.userSecureNotes]);
    React.useEffect(() => {
        const redirecting = leaveIfItemWasDeleted();
        if (redirecting) {
            return;
        }
        logPageView(PageView.ItemSecureNoteDetails);
    }, [leaveIfItemWasDeleted]);
    React.useEffect(() => {
        leaveIfItemWasDeleted();
    }, [leaveIfItemWasDeleted, note]);
    if (!note) {
        return null;
    }
    return <SecureNotesEditGrapheneComponent {...props}/>;
};
export const NoteEditPanel = connect(remoteDataAdapter<InjectedProps, Props>(NoteEditComponent, remoteDataConfig), selectors);
