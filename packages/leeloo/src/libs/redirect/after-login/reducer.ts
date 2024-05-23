import createReducer from 'store/reducers/create';
import { State } from './state';
export default createReducer<State>('DEEP_LNK', {
    hasBeenRedirected: false,
});
