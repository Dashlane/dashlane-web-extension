import { VaultSourceType } from "@dashlane/autofill-contracts";
import { FieldLabelToDataSource } from "../labels/labels";
export const DEFAULT_CLASSIFICATION_TO_DATA_SOURCE_MAPS: FieldLabelToDataSource =
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
    company: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Company]: "name",
        },
      },
      {
        extraValues: ["company_name"],
        source: {
          [VaultSourceType.Company]: "name",
        },
      },
      {
        extraValues: ["job"],
        source: {
          [VaultSourceType.Company]: "jobTitle",
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
    ],
    email: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Email]: "email",
        },
      },
      {
        extraValues: ["confirmation"],
        source: {
          [VaultSourceType.Email]: "email",
        },
      },
    ],
    id_document: [
      {
        extraValues: [],
        source: {},
      },
      {
        extraValues: ["ssn"],
        source: {
          [VaultSourceType.SocialSecurityId]: "idNumber",
        },
      },
      {
        extraValues: ["tax"],
        source: {
          [VaultSourceType.FiscalId]: "idNumber",
        },
      },
      {
        extraValues: ["ssn", "tax"],
        source: {
          [VaultSourceType.SocialSecurityId]: "idNumber",
          [VaultSourceType.FiscalId]: "idNumber",
        },
      },
    ],
    name: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Identity]: "fullName",
        },
      },
      {
        extraValues: ["first"],
        source: {
          [VaultSourceType.Identity]: "firstName",
        },
      },
      {
        extraValues: ["last"],
        source: {
          [VaultSourceType.Identity]: "lastName",
        },
      },
      {
        extraValues: ["middle"],
        source: {
          [VaultSourceType.Identity]: "middleName",
        },
      },
      {
        extraValues: ["middle", "middle_initials"],
        source: {
          [VaultSourceType.Identity]: "middleNameInitial",
        },
      },
      {
        extraValues: ["bank_account"],
        source: {
          [VaultSourceType.BankAccount]: "owner",
        },
      },
      {
        extraValues: ["credit_card"],
        source: {
          [VaultSourceType.PaymentCard]: "ownerName",
        },
      },
      {
        extraValues: ["drivers_license"],
        source: {
          [VaultSourceType.DriverLicense]: "name",
        },
      },
      {
        extraValues: ["id_card"],
        source: {
          [VaultSourceType.IdCard]: "name",
        },
      },
      {
        extraValues: ["ssn"],
        source: {
          [VaultSourceType.SocialSecurityId]: "name",
        },
      },
    ],
    phone: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Phone]: "number",
        },
      },
      {
        extraValues: ["type"],
        source: {
          [VaultSourceType.Phone]: "type",
        },
      },
    ],
    title: [
      {
        extraValues: ["gender"],
        source: {
          [VaultSourceType.Identity]: "title",
        },
      },
      {
        extraValues: ["job"],
        source: {
          [VaultSourceType.Company]: "jobTitle",
        },
      },
    ],
    username: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Identity]: "pseudo",
        },
      },
    ],
  };
