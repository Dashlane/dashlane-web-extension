import { TransactionType } from "Libs/Backup/Transactions/types";
export type MergingRules = {
  [k in TransactionType]?: {
    property: string;
    canonize: boolean;
  }[];
};
export const mergingRules: MergingRules = {
  ADDRESS: [
    { property: "AddressFull", canonize: false },
    { property: "City", canonize: false },
    { property: "ZipCode", canonize: true },
  ],
  AUTHENTIFIANT: [
    { property: "Domain", canonize: false },
    { property: "Email", canonize: false },
    { property: "Login", canonize: false },
    { property: "Note", canonize: false },
    { property: "OtpSecret", canonize: false },
    { property: "OtpUrl", canonize: false },
    { property: "Password", canonize: false },
    { property: "SubdomainOnly", canonize: false },
    { property: "Title", canonize: false },
    { property: "TrustedUrl", canonize: false },
    { property: "UseFixedUrl", canonize: false },
  ],
  BANKSTATEMENT: [{ property: "BankAccountIBAN", canonize: true }],
  COMPANY: [
    { property: "Name", canonize: false },
    { property: "JobTitle", canonize: false },
  ],
  DATA_CHANGE_HISTORY: [{ property: "ObjectId", canonize: true }],
  DRIVERLICENCE: [{ property: "Number", canonize: true }],
  EMAIL: [{ property: "Email", canonize: true }],
  FISCALSTATEMENT: [
    { property: "FiscalNumber", canonize: true },
    { property: "TeledeclarantNumber", canonize: true },
  ],
  GENERATED_PASSWORD: [
    { property: "Domain", canonize: false },
    { property: "GeneratedDate", canonize: false },
    { property: "Password", canonize: false },
  ],
  IDCARD: [{ property: "Number", canonize: true }],
  IDENTITY: [
    { property: "FirstName", canonize: false },
    { property: "LastName", canonize: false },
  ],
  PASSPORT: [{ property: "Number", canonize: true }],
  PAYMENTMEAN_PAYPAL: [
    { property: "Login", canonize: false },
    { property: "Password", canonize: false },
  ],
  PAYMENTMEANS_CREDITCARD: [
    { property: "Bank", canonize: true },
    { property: "CardNumber", canonize: true },
    { property: "CardNumberLastDigits", canonize: true },
    { property: "ExpireMonth", canonize: true },
    { property: "ExpireYear", canonize: true },
    { property: "OwnerName", canonize: true },
  ],
  PERSONALWEBSITE: [{ property: "Website", canonize: false }],
  PHONE: [{ property: "Number", canonize: true }],
  PURCHASE_CATEGORY: [{ property: "CategoryName", canonize: false }],
  PURCHASEBASKET: [{ property: "Id", canonize: false }],
  PURCHASEPAIDBASKET: [
    { property: "AutoTitle", canonize: false },
    { property: "Comment", canonize: false },
    { property: "DeliveryAddressDescription", canonize: false },
    { property: "DeliveryAddressName", canonize: false },
    { property: "MerchantDomain", canonize: true },
    { property: "PaymentMeanDescription", canonize: false },
    { property: "PaymentMeanName", canonize: false },
    { property: "PurchaseDate", canonize: true },
    { property: "TotalAmount", canonize: true },
    { property: "UserTitle", canonize: false },
  ],
  SECURENOTE: [
    { property: "Title", canonize: false },
    { property: "Content", canonize: false },
  ],
  SOCIALSECURITYSTATEMENT: [
    { property: "SocialSecurityNumber", canonize: true },
  ],
};
