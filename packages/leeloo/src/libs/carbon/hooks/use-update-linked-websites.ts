import { linkedWebsitesApi } from "@dashlane/autofill-contracts";
import { useModuleCommands } from "@dashlane/framework-react";
export const useUpdateLinkedWebsites = () => {
  const { updateLinkedWebsites } = useModuleCommands(linkedWebsitesApi);
  const updateLinkedWebsitesAddedByUser = async (
    credentialId: string,
    linkedWebsitesAddedByUser: string[]
  ) => {
    updateLinkedWebsites({
      credentialId: credentialId,
      updatedLinkedWebsitesList: linkedWebsitesAddedByUser,
    });
  };
  return updateLinkedWebsitesAddedByUser;
};
