import { SaveGeneratedPasswordRequest } from "@dashlane/communication";
import { CoreServices } from "Services";
import { saveGeneratedPassword } from "DataManagement/GeneratedPassword";
export async function saveGeneratedPasswordHandler(
  coreServices: CoreServices,
  request: SaveGeneratedPasswordRequest
): Promise<void> {
  const { storeService, sessionService } = coreServices;
  return saveGeneratedPassword(
    storeService,
    sessionService,
    request.password,
    request.url
  );
}
