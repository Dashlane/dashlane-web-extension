import { Diff } from 'utility-types';
import { ListResults, NoteCategoryDetailView } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { connect, Selector } from 'libs/carbonApiConsumer';
import { remoteDataAdapter } from 'libs/remoteDataAdapter';
import { NoteAddPanelComponent, Props } from './secure-notes-add-component';
interface InjectedProps {
    noteCategories: ListResults<NoteCategoryDetailView>;
}
type WrapperProps = Diff<Props, InjectedProps>;
const noteCategoriesSelector: Selector<ListResults<NoteCategoryDetailView>, WrapperProps, void> = {
    query: carbonConnector.getNoteCategories,
};
const selectors = {
    noteCategories: noteCategoriesSelector,
};
const remoteDataConfig = {
    strategies: selectors,
};
export const NoteAddPanel = connect(remoteDataAdapter<InjectedProps, Props>(NoteAddPanelComponent, remoteDataConfig), selectors);
