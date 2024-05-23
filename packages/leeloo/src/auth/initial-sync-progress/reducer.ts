import createReducer from 'store/reducers/create';
import { State } from './types';
export default createReducer<State>('INITIAL_SYNC_PROGRESS', {
    isPending: false,
    isIntroPhasePending: false,
});
