import { firstValueFrom } from "rxjs";
import { CarbonLegacyClient } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import {
  textToArrayBuffer,
  utf8ChunkEncode,
} from "@dashlane/framework-encoding";
import { matchResultObservable } from "@dashlane/framework-types";
import { FlexibleDecryptor } from "@dashlane/framework-dashlane-application";
@Injectable()
export class LocalDataKeyDecryptor {
  public constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private flexibleDecryptor: FlexibleDecryptor
  ) {}
  public async decrypt(transportableData: ArrayBuffer): Promise<ArrayBuffer> {
    const { carbonStateList } = this.carbonLegacyClient.queries;
    return await firstValueFrom(
      carbonStateList({
        paths: [
          "userSession.session.localKey",
          "userSession.session.masterPassword",
          "userSession.session.serverKey",
        ],
      }).pipe(
        matchResultObservable({
          success: ([localKey, masterPassword, serverKey]) => {
            if (typeof localKey === "string") {
              return this.flexibleDecryptor.decrypt(
                textToArrayBuffer(localKey),
                transportableData
              );
            } else if (
              typeof masterPassword === "string" &&
              typeof serverKey === "string"
            ) {
              const key = serverKey + masterPassword;
              const keyUtf8 = utf8ChunkEncode(key);
              return this.flexibleDecryptor.decrypt(
                textToArrayBuffer(keyUtf8),
                transportableData
              );
            } else {
              throw new Error("Wrong types for local data key");
            }
          },
          failure: () => {
            throw new Error("Failure getting state list");
          },
        })
      )
    );
  }
}
