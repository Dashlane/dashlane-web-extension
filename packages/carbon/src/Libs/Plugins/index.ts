export interface CarbonPlugins {
  pbkdf2Plugin?: {
    deriveKey: (
      passphrase: Uint8Array,
      salt: Uint8Array,
      iterationCount: number,
      hashMethod: string,
      hashLength: number
    ) => Uint8Array;
  };
}
let pluginsInstance: CarbonPlugins = {};
export function setPlugins(plugins: CarbonPlugins) {
  pluginsInstance = plugins;
}
export function getPlugins(): CarbonPlugins {
  return pluginsInstance;
}
