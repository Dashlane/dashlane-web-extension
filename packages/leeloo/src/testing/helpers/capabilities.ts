import { Capabilities, CapabilityKey, CapabilityKeys, } from '@dashlane/communication';
export const getMockCapabilities = (): Capabilities => {
    return CapabilityKeys.map((capabilityKey) => ({
        [capabilityKey as CapabilityKey]: {
            enabled: false,
        },
    })) as unknown as Capabilities;
};
