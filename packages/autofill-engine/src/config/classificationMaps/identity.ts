import { VaultSourceType } from "@dashlane/autofill-contracts";
import { FieldLabelToDataSource } from "../labels/labels";
export const IDENTITY_CLASSIFICATION_TO_DATA_SOURCE_MAPS: Partial<FieldLabelToDataSource> =
  {
    address: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Address]: "addressFull",
        },
      },
      {
        extraValues: ["extra"],
        source: {},
      },
      {
        extraValues: ["birth"],
        source: {
          [VaultSourceType.Identity]: "birthPlace",
        },
      },
      {
        extraValues: ["zip"],
        source: {
          [VaultSourceType.Address]: "zipCode",
        },
      },
      {
        extraValues: ["city"],
        source: {
          [VaultSourceType.Address]: "city",
        },
      },
      {
        extraValues: ["country"],
        source: {
          [VaultSourceType.Address]: "country",
        },
      },
      {
        extraValues: ["region"],
        source: {
          [VaultSourceType.Address]: "state",
        },
      },
      {
        extraValues: ["department"],
        source: {
          [VaultSourceType.Address]: "stateLevel2",
        },
      },
      {
        extraValues: ["street"],
        source: {
          [VaultSourceType.Address]: "addressFull",
        },
      },
      {
        extraValues: ["street_number"],
        source: {
          [VaultSourceType.Address]: "streetNumber",
        },
      },
      {
        extraValues: ["door"],
        source: {
          [VaultSourceType.Address]: "door",
        },
      },
      {
        extraValues: ["building"],
        source: {
          [VaultSourceType.Address]: "building",
        },
      },
      {
        extraValues: ["code"],
        source: {
          [VaultSourceType.Address]: "digitCode",
        },
      },
      {
        extraValues: ["floor"],
        source: {
          [VaultSourceType.Address]: "floor",
        },
      },
      {
        extraValues: ["street_type"],
        source: {
          [VaultSourceType.Address]: "streetTitle",
        },
      },
      {
        extraValues: ["stairway"],
        source: {
          [VaultSourceType.Address]: "stairs",
        },
      },
      {
        extraValues: ["address_name"],
        source: {
          [VaultSourceType.Address]: "addressName",
        },
      },
    ],
    date: [
      {
        extraValues: [],
        source: {},
      },
      {
        extraValues: ["day"],
        source: {},
      },
      {
        extraValues: ["month"],
        source: {},
      },
      {
        extraValues: ["year"],
        source: {},
      },
      {
        extraValues: ["birth"],
        source: {
          [VaultSourceType.Identity]: "birthDate",
        },
      },
      {
        extraValues: ["birth", "day"],
        source: {
          [VaultSourceType.Identity]: "birthDay",
        },
      },
      {
        extraValues: ["birth", "month"],
        source: {
          [VaultSourceType.Identity]: "birthMonth",
        },
      },
      {
        extraValues: ["birth", "year"],
        source: {
          [VaultSourceType.Identity]: "birthYear",
        },
      },
      {
        extraValues: ["birth", "month", "day"],
        source: {
          [VaultSourceType.Identity]: "birthMonth",
        },
      },
      {
        extraValues: ["birth", "year", "day"],
        source: {
          [VaultSourceType.Identity]: "birthYear",
        },
      },
      {
        extraValues: ["issue", "drivers_license", "day"],
        source: {
          [VaultSourceType.DriverLicense]: "issueDay",
        },
      },
      {
        extraValues: ["issue", "drivers_license", "month"],
        source: {
          [VaultSourceType.DriverLicense]: "issueMonth",
        },
      },
      {
        extraValues: ["issue", "drivers_license", "year"],
        source: {
          [VaultSourceType.DriverLicense]: "issueYear",
        },
      },
      {
        extraValues: ["issue", "id_card", "day"],
        source: {
          [VaultSourceType.IdCard]: "issueDay",
        },
      },
      {
        extraValues: ["issue", "id_card", "month"],
        source: {
          [VaultSourceType.IdCard]: "issueMonth",
        },
      },
      {
        extraValues: ["issue", "id_card", "year"],
        source: {
          [VaultSourceType.IdCard]: "issueYear",
        },
      },
      {
        extraValues: ["issue", "passport", "day"],
        source: {
          [VaultSourceType.Passport]: "issueDay",
        },
      },
      {
        extraValues: ["issue", "passport", "month"],
        source: {
          [VaultSourceType.Passport]: "issueMonth",
        },
      },
      {
        extraValues: ["issue", "passport", "year"],
        source: {
          [VaultSourceType.Passport]: "issueYear",
        },
      },
      {
        extraValues: ["expiration", "drivers_license", "day"],
        source: {
          [VaultSourceType.DriverLicense]: "expirationDay",
        },
      },
      {
        extraValues: ["expiration", "drivers_license", "month"],
        source: {
          [VaultSourceType.DriverLicense]: "expirationMonth",
        },
      },
      {
        extraValues: ["expiration", "drivers_license", "year"],
        source: {
          [VaultSourceType.DriverLicense]: "expirationYear",
        },
      },
      {
        extraValues: ["expiration", "id_card", "day"],
        source: {
          [VaultSourceType.IdCard]: "expirationDay",
        },
      },
      {
        extraValues: ["expiration", "id_card", "month"],
        source: {
          [VaultSourceType.IdCard]: "expirationMonth",
        },
      },
      {
        extraValues: ["expiration", "id_card", "year"],
        source: {
          [VaultSourceType.IdCard]: "expirationYear",
        },
      },
      {
        extraValues: ["expiration", "passport", "day"],
        source: {
          [VaultSourceType.Passport]: "expirationDay",
        },
      },
      {
        extraValues: ["expiration", "passport", "month"],
        source: {
          [VaultSourceType.Passport]: "expirationMonth",
        },
      },
      {
        extraValues: ["expiration", "passport", "year"],
        source: {
          [VaultSourceType.Passport]: "expirationYear",
        },
      },
    ],
    id_document: [
      {
        extraValues: [],
        source: {},
      },
      {
        extraValues: ["drivers_license"],
        source: {
          [VaultSourceType.DriverLicense]: "idNumber",
        },
      },
      {
        extraValues: ["drivers_license", "citizenship"],
        source: {
          [VaultSourceType.DriverLicense]: "country",
        },
      },
      {
        extraValues: ["id_card"],
        source: {
          [VaultSourceType.IdCard]: "idNumber",
        },
      },
      {
        extraValues: ["id_card", "citizenship"],
        source: {
          [VaultSourceType.IdCard]: "country",
        },
      },
      {
        extraValues: ["passport"],
        source: {
          [VaultSourceType.Passport]: "idNumber",
        },
      },
      {
        extraValues: ["passport", "citizenship"],
        source: {
          [VaultSourceType.Passport]: "country",
        },
      },
      {
        extraValues: ["ssn"],
        source: {
          [VaultSourceType.SocialSecurityId]: "idNumber",
        },
      },
      {
        extraValues: ["ssn", "citizenship"],
        source: {
          [VaultSourceType.SocialSecurityId]: "country",
        },
      },
      {
        extraValues: ["tax"],
        source: {
          [VaultSourceType.FiscalId]: "idNumber",
        },
      },
      {
        extraValues: ["tax", "citizenship"],
        source: {
          [VaultSourceType.FiscalId]: "country",
        },
      },
    ],
    otp: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Credential]: "otpSecret",
        },
      },
    ],
    website: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.PersonalWebsite]: "website",
        },
      },
    ],
  };
