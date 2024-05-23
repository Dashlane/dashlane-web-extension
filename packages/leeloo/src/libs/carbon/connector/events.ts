import { combineEvents } from 'ts-event-bus';
import { CarbonApiConnector, CarbonApiEvents, CarbonLeelooConnector, DeviceLimitCapabilityConnector, DeviceLimitCapabilityEvents, } from '@dashlane/communication';
export const carbonEvents = combineEvents(CarbonLeelooConnector, CarbonApiConnector, DeviceLimitCapabilityConnector);
export type CarbonEvents = typeof CarbonLeelooConnector & CarbonApiEvents & DeviceLimitCapabilityEvents;
