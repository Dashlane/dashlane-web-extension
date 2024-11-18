import { makeDataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { CRYPTO_NODERIVATION_HMAC64 } from "Libs/CryptoCenter/constant";
import { parsePayload } from "Libs/CryptoCenter/transportable-data";
import { deflateUtf16, inflateUtf16 } from "Libs/CryptoCenter";
import { AnonymousBaseEvent, UserBaseEvent } from "@dashlane/hermes";
import { StoreService } from "Store";
interface EncryptEventQueueParams {
  storeService: StoreService;
  encryptionKey: string;
  data: ArrayBuffer;
}
async function encryptEventQueueData({
  storeService,
  encryptionKey,
  data,
}: EncryptEventQueueParams): Promise<string> {
  const emptyServerKey = "";
  const dataEncryptorService = makeDataEncryptorService(storeService);
  const { cryptoConfig } = parsePayload(CRYPTO_NODERIVATION_HMAC64);
  dataEncryptorService.setInstance(
    { raw: encryptionKey },
    emptyServerKey,
    cryptoConfig
  );
  const encryptedData = await dataEncryptorService.getInstance().encrypt(data);
  dataEncryptorService.close();
  return encryptedData;
}
interface DecryptEventQueue {
  storeService: StoreService;
  encryptedData: string;
  encryptionKey: string;
}
async function decryptEventQueueData({
  storeService,
  encryptedData,
  encryptionKey,
}: DecryptEventQueue): Promise<ArrayBuffer> {
  const emptyServerKey = "";
  const dataEncryptorService = makeDataEncryptorService(storeService);
  dataEncryptorService.setInstance({ raw: encryptionKey }, emptyServerKey);
  const recoveryDataArrayBuffer = await dataEncryptorService
    .getInstance()
    .decrypt(encryptedData);
  dataEncryptorService.close();
  return recoveryDataArrayBuffer;
}
export async function encryptEvents(
  storeService: StoreService,
  events: Array<UserBaseEvent | AnonymousBaseEvent>,
  eventLoggerQueueKey: string
): Promise<string> {
  const eventsJSON = JSON.stringify(events);
  const eventsBuffer = deflateUtf16(eventsJSON);
  const eventsEncrypted = await encryptEventQueueData({
    storeService,
    encryptionKey: eventLoggerQueueKey,
    data: eventsBuffer,
  });
  return eventsEncrypted;
}
export async function decryptEvents(
  storeService: StoreService,
  encryptedEvents: string,
  eventLoggerQueueKey: string
): Promise<Array<UserBaseEvent | AnonymousBaseEvent>> {
  const bytes = await decryptEventQueueData({
    storeService,
    encryptedData: encryptedEvents,
    encryptionKey: eventLoggerQueueKey,
  });
  const recoveryDataJSON = inflateUtf16(bytes);
  const events = JSON.parse(recoveryDataJSON) as Array<
    UserBaseEvent | AnonymousBaseEvent
  >;
  return events;
}
