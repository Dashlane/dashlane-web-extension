import { CoreServices } from "Services";
import { secureFileClearAction } from "Session/Store/secureFileStorage";
export async function clearSecureFileStateHandler(
  { storeService }: CoreServices,
  params: string
): Promise<void> {
  storeService.dispatch(secureFileClearAction(params));
  return Promise.resolve();
}
