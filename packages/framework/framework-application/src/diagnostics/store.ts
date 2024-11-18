import { UseCaseScope } from "@dashlane/framework-contracts";
import { PassthroughCodec } from "@dashlane/framework-services";
import { defineStore, StoreCapacity } from "../state";
import { Injectable } from "../dependency-injection/injectable.decorator";
import { DiagnosticsLogs } from "./diagnostics-logger.types";
interface DiagnosticsState {
  logs: DiagnosticsLogs;
}
function isDiagnosticsLogs(x: unknown): x is DiagnosticsState {
  return (
    !!x && typeof x === "object" && "logs" in x && typeof x.logs === "object"
  );
}
@Injectable()
export class DiagnosticsStore extends defineStore<
  DiagnosticsState,
  DiagnosticsState
>({
  persist: true,
  scope: UseCaseScope.Device,
  storeName: "diagnostics-logs",
  capacity: StoreCapacity._100KB,
  codec: PassthroughCodec,
  storage: {
    schemaVersion: 1,
    initialValue: { logs: {} },
    typeGuard: isDiagnosticsLogs,
  },
}) {}
