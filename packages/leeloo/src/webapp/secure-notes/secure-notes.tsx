import { useEffect } from "react";
import { NoteSortField } from "@dashlane/communication";
import { PageView } from "@dashlane/hermes";
import { useModuleCommands } from "@dashlane/framework-react";
import { secureFilesApi } from "@dashlane/vault-contracts";
import { logPageView } from "../../libs/logs/logEvent";
import { PersonalDataSectionView } from "../personal-data-section-view/personal-data-section-view";
import { SortingOptions } from "../list-view/types";
import { SecureNotesProvider } from "./secure-notes-view/secure-notes-context";
import { SecureNotesListView } from "./list/secure-notes-list-view";
export interface State {
  sortingOptions: SortingOptions<NoteSortField>;
}
export const SecureNotes = () => {
  const { fetchSecureFileQuota } = useModuleCommands(secureFilesApi);
  useEffect(() => {
    void fetchSecureFileQuota();
    logPageView(PageView.ItemSecureNoteList);
  }, []);
  return (
    <SecureNotesProvider>
      <PersonalDataSectionView>
        <SecureNotesListView />
      </PersonalDataSectionView>
    </SecureNotesProvider>
  );
};
