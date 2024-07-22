import { Credential } from "../credential.types";
import {
  DriversLicense,
  FiscalId,
  IdCard,
  Passport,
  SocialSecurityId,
} from "../ids";
import { Passkey } from "../passkey.types";
import { BankAccount, PaymentCard } from "../payment";
import {
  Address,
  Company,
  Email,
  Identity,
  Phone,
  Website,
} from "../personal-info";
import { Secret } from "../secret.types";
import { SecureNote } from "../secure-note.types";
export type VaultItem =
  | Address
  | BankAccount
  | Company
  | Credential
  | DriversLicense
  | Email
  | FiscalId
  | IdCard
  | Identity
  | Passkey
  | Passport
  | PaymentCard
  | Phone
  | Secret
  | SecureNote
  | SocialSecurityId
  | Website;
