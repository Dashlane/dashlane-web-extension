import { VaultSourceType } from "@dashlane/autofill-contracts";
import { CapturedValuesAndProperties } from "./personal-data-capture-helpers";
import {
  AllDataCaptureWebcardItem,
  DataCaptureWebcardItem,
} from "../../../Api/types/data-capture";
import { getAddressDataCapture } from "../../abstractions/formatting/formatters/Address/webcard-data";
import { getEmailDataCapture } from "../../abstractions/formatting/formatters/Email/webcard-data";
import { getIdentityDataCapture } from "../../abstractions/formatting/formatters/Identity/webcard-data";
import { getPhoneDataCapture } from "../../abstractions/formatting/formatters/Phone/webcard-data";
import { getWebsiteDataCapture } from "../../abstractions/formatting/formatters/PersonalWebsite/webcard-data";
import { getCreditCardDataCapture } from "../../abstractions/formatting/formatters/PaymentCard/webcard-data";
type WebcardDataCaptureGetterType<T extends VaultSourceType> = Partial<
  Record<
    T,
    (
      capturedData: CapturedValuesAndProperties<VaultSourceType>
    ) => AllDataCaptureWebcardItem<T> | undefined
  >
>;
const webcardDataCaptureGetters: WebcardDataCaptureGetterType<VaultSourceType> =
  {
    [VaultSourceType.Address]: getAddressDataCapture,
    [VaultSourceType.Email]: getEmailDataCapture,
    [VaultSourceType.Identity]: getIdentityDataCapture,
    [VaultSourceType.PaymentCard]: getCreditCardDataCapture,
    [VaultSourceType.Phone]: getPhoneDataCapture,
    [VaultSourceType.PersonalWebsite]: getWebsiteDataCapture,
  };
export const getDataCaptureWebcardItem = <T extends VaultSourceType>(
  webcardItemType: T,
  capturedData: CapturedValuesAndProperties<VaultSourceType>
): DataCaptureWebcardItem | undefined =>
  webcardDataCaptureGetters[webcardItemType]?.(capturedData);
