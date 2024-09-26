import { State } from "Store";
import { platformInfoSelector } from "Authentication/selectors";
import { userLoginSelector } from "Session/selectors";
import { deviceNameSelector } from "Session/Store/localSettings/selector";
import { personalDataSelector } from "DataManagement/PersonalData/selectors";
import { countAllGeneratedPasswordsSelector } from "DataManagement/GeneratedPassword/selectors";
import { countAllEmailsSelector } from "DataManagement/PersonalInfo/Email/selectors";
import { countAllCredentialsSelector } from "DataManagement/Credentials/selectors/count-all-credentials.selector";
import { unsafeAllCredentialsSelector } from "DataManagement/Credentials/selectors/unsafe-all-credentials.selector";
import { forceCategorizableItemsSelector } from "DataManagement/SmartTeamSpaces/forced-categorization.selectors";
import { TeamSpaceContentControlState } from "DataManagement/SmartTeamSpaces/team-space-content-control.domain-types";
const teamSpaceContentControlItemsCountSelector = (state: State) => ({
  KWAuthentifiant: countAllCredentialsSelector(state),
  KWEmail: countAllEmailsSelector(state),
  KWGeneratedPassword: countAllGeneratedPasswordsSelector(state),
});
export const teamSpaceContentControlStateSelector = (
  state: State
): Omit<TeamSpaceContentControlState, "spaces"> => ({
  credentials: unsafeAllCredentialsSelector(state),
  itemCountByType: teamSpaceContentControlItemsCountSelector(state),
  items: forceCategorizableItemsSelector(state),
  personalData: personalDataSelector(state),
  platformInfo: platformInfoSelector(state),
  login: userLoginSelector(state),
  deviceName: deviceNameSelector(state),
});
