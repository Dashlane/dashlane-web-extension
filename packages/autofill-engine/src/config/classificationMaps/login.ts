import { OtherSourceType, VaultSourceType } from "@dashlane/autofill-contracts";
import { FieldLabelToDataSource } from "../labels/labels";
export const LOGIN_CLASSIFICATION_TO_DATA_SOURCE_MAPS: FieldLabelToDataSource =
  {
    action: [
      {
        extraValues: [],
        source: {},
      },
      {
        extraValues: ["forgot_password"],
        source: {},
      },
      {
        extraValues: ["login"],
        source: {
          [OtherSourceType.SubmitButton]: OtherSourceType.SubmitButton,
        },
      },
      {
        extraValues: ["next"],
        source: {
          [OtherSourceType.SubmitButton]: OtherSourceType.SubmitButton,
        },
      },
    ],
    email: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Credential]: "email",
          [VaultSourceType.Email]: "email",
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
    password: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Credential]: "password",
          [VaultSourceType.GeneratedPassword]: "password",
        },
      },
    ],
    username: [
      {
        extraValues: [],
        source: {
          [VaultSourceType.Credential]: "login",
        },
      },
      {
        extraValues: ["secondary"],
        source: {
          [VaultSourceType.Credential]: "secondaryLogin",
        },
      },
    ],
    id_document: [
      {
        extraValues: ["ssn"],
        source: {
          [VaultSourceType.Credential]: "login",
          [VaultSourceType.SocialSecurityId]: "idNumber",
        },
      },
      {
        extraValues: ["tax"],
        source: {
          [VaultSourceType.Credential]: "login",
          [VaultSourceType.FiscalId]: "idNumber",
        },
      },
      {
        extraValues: ["ssn", "tax"],
        source: {
          [VaultSourceType.Credential]: "login",
          [VaultSourceType.SocialSecurityId]: "idNumber",
          [VaultSourceType.FiscalId]: "idNumber",
        },
      },
    ],
  };
