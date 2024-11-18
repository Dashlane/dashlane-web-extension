import { CarbonLegacyClient } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  textToArrayBuffer,
} from "@dashlane/framework-encoding";
import { isFailure, isSuccess } from "@dashlane/framework-types";
import { firstValueFrom, mergeMap, Observable } from "rxjs";
import {
  SessionsStateStore,
  SessionStoreMutex,
} from "../stores/sessions-state.store";
import { SessionKeyCryptoSettingsRepository } from "../session-key/session-key-crypto-repository";
@Injectable()
export class LocalDataKeyRepository {
  constructor(
    private carbon: CarbonLegacyClient,
    private store: SessionsStateStore,
    private settings: SessionKeyCryptoSettingsRepository
  ) {}
  getLocalKey(login: string): Observable<ArrayBuffer | null> {
    const generate = this.generate.bind(this);
    const changeLocalKey = this.changeLocalKey.bind(this);
    return this.store.state$.pipe(
      mergeMap(async (state) => {
        if (login in state) {
          const sessionState = state[login];
          if (sessionState.status !== "open") {
            throw new Error("Session is not open ");
          }
          const localKey = sessionState.localKey;
          return localKey ? base64ToArrayBuffer(localKey) : null;
        }
        const localKey = await generate();
        await changeLocalKey(login, localKey);
        return localKey;
      })
    );
  }
  async changeLocalKey(login: string, key: ArrayBuffer | null) {
    const { store } = this;
    const settingsResult = await firstValueFrom(this.settings.getConfig(login));
    if (!isSuccess(settingsResult)) {
      throw new Error("Fail to get crypto settings");
    }
    await SessionStoreMutex.runExclusive(async () => {
      const state = await store.getState();
      if (!(login in state)) {
        throw new Error("Session is not created");
      }
      const loginState = state[login];
      if (loginState.status !== "open") {
        throw new Error("Session is not open");
      }
      await store.set({
        ...state,
        [login]: {
          status: "open",
          localKey: key ? arrayBufferToBase64(key) : null,
          sessionKey: loginState.sessionKey,
        },
      });
    });
  }
  public async generateKeyIfNotExist(login: string): Promise<void> {
    await firstValueFrom(this.getLocalKey(login));
  }
  public async generate(): Promise<ArrayBuffer | null> {
    const { carbonStateList } = this.carbon.queries;
    const carbonResult = await firstValueFrom(
      carbonStateList({
        paths: ["userSession.session.localKey"],
      })
    );
    if (isFailure(carbonResult)) {
      throw new Error("Failure getting state list");
    }
    const [localKey] = carbonResult.data;
    if (typeof localKey === "string") {
      return textToArrayBuffer(localKey);
    }
    return null;
  }
}
