import type { client } from "@serenity-kit/opaque";
export type OpaqueClient = typeof client;
let _opaqueClient: OpaqueClient | null = null;
async function importAndWaitReady() {
  const { client, ready } = await import(`@serenity-kit/opaque`);
  await ready;
  return { client };
}
export async function getOpaqueClient(): Promise<OpaqueClient> {
  if (!_opaqueClient) {
    const { client } = await importAndWaitReady();
    _opaqueClient = client;
  }
  return _opaqueClient;
}
