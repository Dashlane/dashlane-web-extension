import {
  Injectable,
  JsonApplicationResourceFetcher,
  JsonApplicationResourceLoader,
} from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
interface PinCodeServerConfigResourceJson {
  serverIdentifier: string;
  serverPublicKey: string;
}
function isPinCodeServerConfigResourceJson(
  x: unknown
): x is PinCodeServerConfigResourceJson {
  return (
    !!x &&
    typeof x === "object" &&
    "serverIdentifier" in x &&
    "serverPublicKey" in x
  );
}
@Injectable()
export class PinCodeServerConfigResourceLoader extends JsonApplicationResourceLoader<PinCodeServerConfigResourceJson> {
  constructor(
    fetcher: JsonApplicationResourceFetcher,
    serverApiClient: ServerApiClient
  ) {
    super(
      `/assets/pin-code.${
        serverApiClient.baseUrl === "__REDACTED__" ? "prod" : "__REDACTED__"
      }.config.json`,
      fetcher
    );
  }
  public loadResource(jsonObject: unknown) {
    if (!isPinCodeServerConfigResourceJson(jsonObject)) {
      throw new Error("File corrupted");
    }
    return jsonObject;
  }
}
