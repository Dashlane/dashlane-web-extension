import { Lee } from "../../../lee";
import { DialogContextProvider } from "../../dialog";
import { PersonalDataSectionView } from "../../personal-data-section-view/personal-data-section-view";
import { MultiselectProvider } from "../../list-view/multi-select";
import { CredentialsListView } from "../list/credentials-list-view";
import { SavedCredentialNotification } from "./saved-credential-notification";
import { CredentialsProvider } from "./credentials-context";
import { HasCredentialsProvider } from "./has-credentials-context";
interface Props {
  lee: Lee;
}
const DIALOG_ID = "dashlane-credentials-dialog";
export const CredentialsView = ({ lee }: Props) => (
  <CredentialsProvider>
    <HasCredentialsProvider>
      <div id={DIALOG_ID} />
      <DialogContextProvider dialogId={DIALOG_ID}>
        <MultiselectProvider>
          <PersonalDataSectionView>
            <SavedCredentialNotification lee={lee} />
            <CredentialsListView />
          </PersonalDataSectionView>
        </MultiselectProvider>
      </DialogContextProvider>
    </HasCredentialsProvider>
  </CredentialsProvider>
);
