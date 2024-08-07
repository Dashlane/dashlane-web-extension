import {
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { WebcardMetadataType, WebcardSpacesData } from "./webcard-data-base";
export enum WebcardItemType {
  SimpleItem = "SimpleItem",
  EnhancedItem = "EnhancedItem",
}
export type WebcardItemProperties<T extends VaultSourceType> = Partial<
  Record<keyof VaultAutofillViewInterfaces[T], string>
>;
interface WebcardItemBase {
  readonly type: WebcardItemType;
  readonly itemId: string;
  readonly itemType: VaultSourceType;
  readonly closeOnSelect?: boolean;
  readonly title: string;
  readonly content: string;
  readonly space?: WebcardSpacesData;
  readonly isProtected: boolean;
  readonly metadataKeys?: WebcardMetadataType[];
}
export interface SimpleWebcardItem extends WebcardItemBase {
  readonly type: WebcardItemType.SimpleItem;
  readonly isLinkedWebsite?: boolean;
  readonly communicationType?: string;
  readonly isTitleFixedType?: boolean;
  readonly domain?: string;
}
export interface EnhancedWebcardItem extends WebcardItemBase {
  readonly type: WebcardItemType.EnhancedItem;
  readonly expired?: boolean;
  readonly aboutToExpire?: boolean;
  readonly incomplete?: boolean;
  readonly country?: string;
  readonly displayCountry?: string;
  readonly backgroundName?: string;
  readonly paymentType?: string;
  readonly color?: string;
}
export type WebcardItem = SimpleWebcardItem | EnhancedWebcardItem;
