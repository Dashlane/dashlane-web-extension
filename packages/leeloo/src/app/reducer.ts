import { makeLocalReducer } from 'redux-cursor';
import Team from 'team/reducer';
const reducer = makeLocalReducer('app', {}, [Team]);
export default reducer;
