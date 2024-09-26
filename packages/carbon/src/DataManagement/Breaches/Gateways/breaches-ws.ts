import { flatten } from "ramda";
import { get as httpGet } from "Libs/Http";
import { ExceptionCriticality } from "@dashlane/communication";
import { WSService } from "Libs/WS";
import { asyncMap } from "Utils/async-map";
import { makeAsymmetricEncryption } from "Libs/CryptoCenter/SharingCryptoService";
import { HashAlgorithm } from "Libs/CryptoCenter/Primitives/AsymmetricEncryption";
import { makeDataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import {
  arrayBufferToText,
  base64ToBuffer,
} from "Libs/CryptoCenter/Helpers/Helper";
import { isWSResponseSuccess } from "Libs/WS/helpers";
import { sendExceptionLog } from "Logs/Exception";
import {
  premiumStatusSelector,
  sharingKeysSelector,
  userLoginSelector,
} from "Session/selectors";
import { StoreService } from "Store";
import { ukiSelector } from "Authentication";
import { hasDarkWebMonitoringFeature } from "DataManagement/Breaches/Gateways/helpers";
import {
  BreachContent,
  VersionedBreachContent,
} from "DataManagement/Breaches/types";
import { BreachesGateway } from "DataManagement/Breaches/Gateways/interfaces";
import { isSupportedBreachContent } from "DataManagement/Breaches/guards";
import { deduplicateBreachContents } from "DataManagement/Breaches/breach-helpers";
import {
  ExtractedPasswords,
  GetLatestPrivateBreachesResult,
  GetLatestPublicBreachesResult,
  S3FileBreachContent,
} from "DataManagement/Breaches/Gateways/types";
import {
  getLeakedPasswordFromIncomingDataLeakDetails,
  isBreachesWSResponseNotModified,
  makeIncomingBreach,
} from "DataManagement/Breaches/Gateways/helpers";
import { deflatedUtf8ToUtf16 } from "Libs/CryptoCenter";
export class BreachesWS implements BreachesGateway {
  constructor(
    private wsService: WSService,
    private storeService: StoreService
  ) {}
  public async getLatestPublicBreaches(
    sinceRevision: number
  ): Promise<GetLatestPublicBreachesResult> {
    const state = this.storeService.getState();
    const login = userLoginSelector(state);
    const uki = ukiSelector(state);
    if (login === null || uki === null) {
      throw new Error(
        "[Breaches] - getLatestPublicBreaches: no current authenticated user"
      );
    }
    const response = await this.wsService.breaches.get({
      login,
      uki,
      revision: sinceRevision,
    });
    if (!isWSResponseSuccess(response)) {
      const errorMsg =
        `[Breaches] getLatestPublicBreaches: ${response.message}` +
        `(statusCode: ${response.code})`;
      throw new Error(errorMsg);
    }
    const { content } = response;
    const { latest, filesToDownload, revision } = content;
    const breachesFromFiles = await this.downloadFileBreaches(filesToDownload);
    const allBreaches = [...latest, ...breachesFromFiles];
    const supportedBreaches = allBreaches.filter(isSupportedBreachContent);
    const uniqueBreaches = deduplicateBreachContents(supportedBreaches);
    const breaches = uniqueBreaches.map((breachContent) =>
      makeIncomingBreach(breachContent, [])
    );
    return {
      revision,
      breaches,
    };
  }
  public async getLatestPrivateBreaches(
    sinceDate: number
  ): Promise<GetLatestPrivateBreachesResult | null> {
    const state = this.storeService.getState();
    const premiumStatus = premiumStatusSelector(state);
    if (!hasDarkWebMonitoringFeature(premiumStatus)) {
      return null;
    }
    const login = userLoginSelector(state);
    const uki = ukiSelector(state);
    if (login === null || uki === null) {
      throw new Error(
        "[Breaches] - getLatestPrivateBreaches: no current authenticated user"
      );
    }
    const response = await this.wsService.dataleaks.leaks({
      login,
      uki,
      wantsDetails: true,
      includeDisabled: false,
      lastUpdateDate: sinceDate,
    });
    if (!isWSResponseSuccess(response)) {
      if (isBreachesWSResponseNotModified(response)) {
        return {
          breaches: [],
          refreshDate: sinceDate,
        };
      }
      const detailedCode =
        response.error && response.error.code
          ? `, code: ${response.error.code}`
          : "";
      const errorMsg =
        `[Breaches] - getLatestPrivateBreaches: ${response.message} (` +
        `statusCode: ${response.code}` +
        `${detailedCode})`;
      throw new Error(errorMsg);
    }
    const { content } = response;
    const { details, leaks, lastUpdateDate } = content;
    const leakedPasswordsByBreachId = await this.extractLeakedPasswords(
      details
    );
    const supportedBreaches = leaks.filter(isSupportedBreachContent);
    const uniqueBreaches = deduplicateBreachContents(supportedBreaches);
    const breaches = uniqueBreaches.map((b: BreachContent) =>
      makeIncomingBreach(b, leakedPasswordsByBreachId[b.id] || [])
    );
    return {
      breaches,
      refreshDate: lastUpdateDate,
    };
  }
  private async downloadFileBreaches(
    urls: string[]
  ): Promise<VersionedBreachContent[]> {
    return flatten(await asyncMap(urls, this.downloadFileBreach));
  }
  private async downloadFileBreach(
    url: string
  ): Promise<VersionedBreachContent[]> {
    try {
      const { data } = await httpGet<S3FileBreachContent>(url);
      return data.breaches;
    } catch (exception) {
      const errorMsg = `[Breaches] - downloadFileBreach: ${exception}`;
      const error = new Error(errorMsg);
      sendExceptionLog({ error, code: ExceptionCriticality.ERROR });
      return [];
    }
  }
  private async extractLeakedPasswords(details?: {
    cipheredKey: string;
    cipheredInfo: string;
  }): Promise<ExtractedPasswords> {
    try {
      if (!details || !details.cipheredKey || !details.cipheredInfo) {
        return {};
      }
      const state = this.storeService.getState();
      const sharingKeys = sharingKeysSelector(state);
      if (!sharingKeys || !sharingKeys.publicKey || !sharingKeys.privateKey) {
        return {};
      }
      const { privateKey } = sharingKeys;
      const sha1Crypto = makeAsymmetricEncryption({
        hashAlgorithm: HashAlgorithm.SHA_1,
      });
      const aesKeyB64 = await sha1Crypto.decrypt(
        privateKey,
        details.cipheredKey
      );
      const encryptorService = makeDataEncryptorService(this.storeService);
      const aesKeyBuffer = base64ToBuffer(aesKeyB64);
      const aesKeyRaw = arrayBufferToText(aesKeyBuffer);
      encryptorService.setInstance({ raw: aesKeyRaw }, "");
      const bytes = await encryptorService
        .getInstance()
        .decrypt(details.cipheredInfo);
      const clearInfoStr = deflatedUtf8ToUtf16(bytes, {
        skipInflate: true,
      });
      const clearInfo: unknown = JSON.parse(clearInfoStr);
      return getLeakedPasswordFromIncomingDataLeakDetails(clearInfo);
    } catch (exception) {
      const errorMsg = `[Breaches] - extractLeakedPasswords: ${exception}`;
      const error = new Error(errorMsg);
      sendExceptionLog({ error });
      return {};
    }
  }
}
