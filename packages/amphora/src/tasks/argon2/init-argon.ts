import { logger } from "../../logs/app-logger";
import { ARGON2_WASM } from "./constants";
export function initArgon(): void {
  try {
    self.loadArgon2WasmBinary = async () => {
      const response = await fetch(ARGON2_WASM);
      const binaryContent = await response.arrayBuffer();
      return new Uint8Array(binaryContent);
    };
  } catch (error) {
    logger.error("Failed to assign to self.loadArgon2WasmBinary", {
      error,
    });
    throw error;
  }
}
