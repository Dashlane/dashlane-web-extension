import {
  Country,
  DataModelType,
  PhoneType,
  SaveOrigin,
  SavePersonalDataItemFromCapture,
} from "@dashlane/communication";
import {
  CountryForAutofill,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { AutofillEngineContext } from "../../../Api/server/context";
import { DataCaptureWebcardItem } from "../../../Api/types/data-capture";
import { AutofillEngineActionsWithOptions } from "../../abstractions/messaging/action-serializer";
function mapCountryFromCountryForAutofill(
  country: CountryForAutofill
): Country {
  if (country in Country) {
    return country as Country;
  }
  return Country.NO_TYPE;
}
export const formatCapturableTypesIntoCarbonSaveRequest = (
  webcardData: DataCaptureWebcardItem
): SavePersonalDataItemFromCapture | undefined => {
  switch (webcardData.type) {
    case VaultSourceType.Email:
      return {
        kwType: DataModelType.KWEmail,
        origin: SaveOrigin.MAV_DATACAPTURE,
        content: {
          email: webcardData.email,
          emailName: webcardData.email,
          type: "NO_TYPE",
        },
      };
    case VaultSourceType.Phone:
      return {
        kwType: DataModelType.KWPhone,
        origin: SaveOrigin.MAV_DATACAPTURE,
        content: {
          type: PhoneType.PHONE_TYPE_ANY,
          phoneName: webcardData.number,
          number: webcardData.number,
          localeFormat: mapCountryFromCountryForAutofill(
            webcardData.localeFormat
          ),
        },
      };
    case VaultSourceType.Address:
      return {
        kwType: DataModelType.KWAddress,
        origin: SaveOrigin.MAV_DATACAPTURE,
        content: {
          addressName: "",
          addressFull: webcardData.addressFull,
          city: webcardData.city,
          zipCode: webcardData.zipCode,
          country: webcardData.country,
          localeFormat: mapCountryFromCountryForAutofill(
            webcardData.localeFormat
          ),
          receiver: "",
          state: "",
          streetNumber: "",
          building: "",
          stairs: "",
          floor: "",
          door: "",
          digitCode: "",
        },
      };
    case VaultSourceType.Identity:
      return {
        kwType: DataModelType.KWIdentity,
        origin: SaveOrigin.MAV_DATACAPTURE,
        content: {
          title: "",
          firstName: webcardData.firstName,
          middleName: "",
          lastName: webcardData.lastName,
          pseudo: "",
          birthDate: webcardData.birthDate,
          birthPlace: webcardData.birthPlace,
        },
      };
    case VaultSourceType.PersonalWebsite:
      return {
        kwType: DataModelType.KWPersonalWebsite,
        origin: SaveOrigin.MAV_DATACAPTURE,
        content: {
          website: webcardData.website,
          name: webcardData.website,
        },
      };
    case VaultSourceType.PaymentCard:
      return {
        kwType: DataModelType.KWPaymentMean_creditCard,
        origin: SaveOrigin.MAV_DATACAPTURE,
        content: {
          cardName: webcardData.cardName,
          cardNumber: webcardData.cardNumber,
          expireMonth: webcardData.expireMonth,
          expireYear: webcardData.expireYear,
          ownerName: webcardData.ownerName,
          securityCode: webcardData.securityCode,
          personalNote: "",
        },
      };
    default:
      return undefined;
  }
};
export const savePersonalDataHandler = async (
  context: AutofillEngineContext,
  _actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  personalDataInfo: DataCaptureWebcardItem[]
): Promise<void> => {
  const loginStatus = await context.connectors.carbon.getUserLoginStatus();
  if (!loginStatus.loggedIn) {
    return;
  }
  personalDataInfo.forEach((dataToSave) => {
    const formatedCarbonSaveRequest =
      formatCapturableTypesIntoCarbonSaveRequest(dataToSave);
    if (formatedCarbonSaveRequest) {
      void context.connectors.legacyCarbon.savePersonalDataItem(
        formatedCarbonSaveRequest
      );
    }
  });
};
