import { CoreServices } from "Services";
import { secureFileChunkReadyAction } from "Session/Store/secureFileStorage";
export async function chunkTransferDoneHandler(
  { storeService }: CoreServices,
  params: string
): Promise<void> {
  storeService.dispatch(secureFileChunkReadyAction(params));
  return Promise.resolve();
}
