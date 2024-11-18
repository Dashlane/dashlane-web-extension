import { logger } from "../../logs/app-logger";
import { ARGON2_JS_WRAPPER_FOR_WASM, ARGON2_WASM } from "./constants";
export function initArgonForServiceWorker(): void {
  try {
    self.loadArgon2WasmModule = () => {
      importScripts(ARGON2_JS_WRAPPER_FOR_WASM);
      return Promise.resolve();
    };
    self.loadArgon2WasmBinary = async () => {
      const response = await fetch(ARGON2_WASM);
      const binaryContent = await response.arrayBuffer();
      return new Uint8Array(binaryContent);
    };
    importScripts(ARGON2_JS_WRAPPER_FOR_WASM);
  } catch (error) {
    logger.error("Error when importing ARGON2_JS_WRAPPER_FOR_WASM script", {
      error,
    });
    throw error;
  }
}
