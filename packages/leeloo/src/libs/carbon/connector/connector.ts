import { CarbonEvents } from './events';
import { getExtensionCarbonConnector } from 'libs/carbon/extension/extensionCarbon';
import { getEmbeddedCarbonConnector } from 'libs/carbon/embed/embeddedCarbon';
const carbonConnector: CarbonEvents = CARBON_EMBEDDED
    ? getEmbeddedCarbonConnector()
    : getExtensionCarbonConnector();
export { carbonConnector };
