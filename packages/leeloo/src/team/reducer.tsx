import { makeLocalReducer } from "redux-cursor";
import activeDirectorySettingsReducer from "./settings/directory-sync/active-directory/reducer";
import duoSettingsReducer from "./settings/duo/reducer";
import masterPasswordPoliciesSettingsReducer from "./settings/master-password-policies/reducer";
import membersReducer from "./members/member-actions/reducer";
const reducer = makeLocalReducer("team", {}, [
  activeDirectorySettingsReducer,
  duoSettingsReducer,
  masterPasswordPoliciesSettingsReducer,
  membersReducer,
]);
export default reducer;
