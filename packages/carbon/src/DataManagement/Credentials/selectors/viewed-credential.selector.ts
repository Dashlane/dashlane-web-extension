import { CredentialDetailView } from "@dashlane/communication";
import { State } from "Store";
import { viewCredential } from "DataManagement/Credentials";
import { limitedSharingItemsSelector } from "Sharing/2/Services/selectors/limited-sharing-items.selector";
import { sharingDataSelector } from "Sharing/2/Services/selectors/sharing-data.selector";
import { credentialSelector } from "DataManagement/Credentials/selectors/credential.selector";
import { credentialCategoriesSelector } from "DataManagement/Credentials/selectors/credential-categories.selector";
import { userIdSelector } from "Session/selectors";
import { iconsSelector } from "DataManagement/Icons/selectors";
import { spacesSelector } from "DataManagement/Spaces/selectors";
export const viewedCredentialSelector = (
  state: State,
  credentialId: string
): CredentialDetailView | undefined => {
  const credential = credentialSelector(state, credentialId);
  if (!credential) {
    return undefined;
  }
  const categories = credentialCategoriesSelector(state);
  const sharingData = sharingDataSelector(state);
  const userId = userIdSelector(state);
  const limitedSharingItems = limitedSharingItemsSelector(state);
  const icons = iconsSelector(state);
  const spaces = spacesSelector(state);
  return viewCredential(
    credential,
    sharingData,
    userId,
    limitedSharingItems,
    categories,
    icons,
    spaces
  );
};
