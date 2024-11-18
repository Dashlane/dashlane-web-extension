import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
} from "@dashlane/framework-encoding";
import { Injectable } from "@dashlane/framework-application";
import { ExportSessionKeyCryptoStore } from "../stores/export-session-key.store";
import { concatMap, Observable } from "rxjs";
import { KeyGeneratorAes256 } from "@dashlane/framework-dashlane-application";
@Injectable()
export class ExportedSessionKeyCryptoManager {
  constructor(
    private readonly store: ExportSessionKeyCryptoStore,
    private readonly keyGenerator: KeyGeneratorAes256
  ) {}
  async updateAndSetEncryptionKey(): Promise<ArrayBuffer> {
    const key = await this.keyGenerator.generate();
    await this.store.set({ encryptionKey: arrayBufferToBase64(key) });
    return key;
  }
  getOrCreateEncryptionKey(): Observable<ArrayBuffer> {
    return this.store.state$.pipe(
      concatMap(async (state) => {
        if (state.encryptionKey) {
          return base64ToArrayBuffer(state.encryptionKey);
        }
        return await this.updateAndSetEncryptionKey();
      })
    );
  }
}
