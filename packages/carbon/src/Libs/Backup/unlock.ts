import type { SyncArgs } from "Libs/Backup/types";
import { logWarn } from "Logs/Debugger";
function wasLockAcquired(lock: string): boolean {
  return lock && lock !== "nolock";
}
export async function unlock(syncArgs: SyncArgs, lock: string) {
  if (!wasLockAcquired(lock)) {
    return;
  }
  const { login, ws, uki } = syncArgs;
  try {
    await ws.backup.unlock({
      login,
      uki,
      lock,
    });
  } catch (error) {
    logWarn({
      tag: "Sync",
      message: `Unlock failed: ${error}`,
    });
  }
}
