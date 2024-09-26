import {
  CountryCode,
  getCountryCallingCode,
  isSupportedCountry,
} from "libphonenumber-js";
import {
  Address,
  Company,
  Country,
  Email,
  Identity,
  PersonalWebsite,
  Phone,
} from "@dashlane/communication";
import { handleSpecialCharacter } from "./handle-special-character";
import { formatDataToCSV, formatHeader } from "./helpers";
import { PersonalDataVaultItems } from "DataManagement/types";
const getPhoneNumberWithCallingCode = (phoneData: Phone): string => {
  const { LocaleFormat: localeFormat, Number: phoneNumber } = phoneData;
  const isLocalized =
    !!localeFormat &&
    localeFormat !== Country.UNIVERSAL &&
    localeFormat !== Country.NO_TYPE &&
    isSupportedCountry(localeFormat);
  if (isLocalized) {
    const countryCode = Country[phoneData.LocaleFormat] as CountryCode;
    const callingCode = getCountryCallingCode(countryCode);
    return `+${callingCode}${phoneNumber}`;
  }
  return phoneNumber;
};
export function getPersonalInfoExport(
  personalData: PersonalDataVaultItems
): string {
  const nameData = personalData.identities;
  const emailData = personalData.emails;
  const phoneData = personalData.phones;
  const addressData = personalData.addresses;
  const companyData = personalData.companies;
  const websiteData = personalData.personalWebsites;
  const metaData = [
    { headerKey: "type", dataKey: "type" },
    { headerKey: "title", dataKey: "Title" },
    { headerKey: "first_name", dataKey: "FirstName" },
    { headerKey: "middle_name", dataKey: "MiddleName" },
    { headerKey: "last_name", dataKey: "LastName" },
    { headerKey: "login", dataKey: "Pseudo" },
    { headerKey: "date_of_birth", dataKey: "BirthDate" },
    { headerKey: "place_of_birth", dataKey: "BirthPlace" },
    { headerKey: "email", dataKey: "Email" },
    { headerKey: "email_type", dataKey: "Type" },
    { headerKey: "item_name", dataKey: "Name" },
    { headerKey: "phone_number", dataKey: "Number" },
    { headerKey: "address", dataKey: "AddressFull" },
    { headerKey: "country", dataKey: "Country" },
    { headerKey: "state", dataKey: "State" },
    { headerKey: "city", dataKey: "City" },
    { headerKey: "zip", dataKey: "ZipCode" },
    { headerKey: "address_recipient", dataKey: "Receiver" },
    { headerKey: "address_building", dataKey: "Building" },
    { headerKey: "address_apartment", dataKey: "Door" },
    { headerKey: "address_floor", dataKey: "Floor" },
    { headerKey: "address_door_code", dataKey: "DigitCode" },
    { headerKey: "job_title", dataKey: "JobTitle" },
    { headerKey: "url", dataKey: "Website" },
  ];
  const filterNameData = (names: Identity[]) => {
    return names.map((name) => {
      return metaData
        .map((data) => {
          const filteredValue = `${name[data.dataKey] ?? ""}`;
          if (data.dataKey === "type") {
            return handleSpecialCharacter("name");
          } else {
            const value = `${filteredValue}`;
            return handleSpecialCharacter(value);
          }
        })
        .join(",");
    });
  };
  const formatNameData = (names: Identity[]): string => {
    return filterNameData(names).join("\r\n");
  };
  const filterEmailData = (emails: Email[]) => {
    return emails.map((email) => {
      return metaData
        .map((data) => {
          const filteredValue = `${email[data.dataKey] ?? ""}`;
          if (data.dataKey === "type") {
            return handleSpecialCharacter("email");
          } else if (data.dataKey === "Type") {
            if (filteredValue === "PERSO") {
              return handleSpecialCharacter("personal");
            } else {
              return handleSpecialCharacter("business");
            }
          } else if (data.dataKey === "Name") {
            const itemName = email.EmailName ?? "";
            return handleSpecialCharacter(itemName);
          } else {
            const value = `${filteredValue}`;
            return handleSpecialCharacter(value);
          }
        })
        .join(",");
    });
  };
  const formatEmailData = (emails: Email[]): string => {
    return filterEmailData(emails).join("\r\n");
  };
  const filterPhoneData = (phones: Phone[]) => {
    return phones.map((phone) => {
      return metaData
        .map((data) => {
          const filteredValue = `${phone[data.dataKey] ?? ""}`;
          if (data.dataKey === "type") {
            return handleSpecialCharacter("number");
          } else if (data.dataKey === "Type") {
            return handleSpecialCharacter("");
          } else if (data.dataKey === "Name") {
            const itemName = phone.PhoneName ?? "";
            return handleSpecialCharacter(itemName);
          } else if (data.dataKey === "Number") {
            const phoneNumber = getPhoneNumberWithCallingCode(phone);
            return handleSpecialCharacter(phoneNumber);
          } else {
            const value = `${filteredValue}`;
            return handleSpecialCharacter(value);
          }
        })
        .join(",");
    });
  };
  const formatPhoneData = (phones: Phone[]): string => {
    return filterPhoneData(phones).join("\r\n");
  };
  const filterAddressData = (addresses: Address[]) => {
    return addresses.map((address) => {
      return metaData
        .map((data) => {
          const filteredValue = `${address[data.dataKey] ?? ""}`;
          if (data.dataKey === "type") {
            return handleSpecialCharacter("address");
          } else if (data.dataKey === "Name") {
            const itemName = address["AddressName"] ?? "";
            return handleSpecialCharacter(itemName);
          } else {
            const value = `${filteredValue}`;
            return handleSpecialCharacter(value);
          }
        })
        .join(",");
    });
  };
  const formatAddressData = (addresses: Address[]): string => {
    return filterAddressData(addresses).join("\r\n");
  };
  const filterCompanyData = (companies: Company[]) => {
    return companies.map((company) => {
      return metaData
        .map((data) => {
          const filteredValue = `${company[data.dataKey] ?? ""}`;
          if (data.dataKey === "type") {
            return handleSpecialCharacter("company");
          } else {
            const value = `${filteredValue}`;
            return handleSpecialCharacter(value);
          }
        })
        .join(",");
    });
  };
  const formatCompanyData = (companies: Company[]): string => {
    return filterCompanyData(companies).join("\r\n");
  };
  const filterWebsiteData = (websites: PersonalWebsite[]) => {
    return websites.map((website) => {
      return metaData
        .map((data) => {
          const filteredValue = `${website[data.dataKey] ?? ""}`;
          if (data.dataKey === "type") {
            return handleSpecialCharacter("website");
          } else {
            const value = `${filteredValue}`;
            return handleSpecialCharacter(value);
          }
        })
        .join(",");
    });
  };
  const formatWebsiteData = (websites: PersonalWebsite[]): string => {
    return filterWebsiteData(websites).join("\r\n");
  };
  return formatDataToCSV([
    formatHeader(metaData),
    formatNameData(nameData),
    formatEmailData(emailData),
    formatPhoneData(phoneData),
    formatAddressData(addressData),
    formatCompanyData(companyData),
    formatWebsiteData(websiteData),
  ]);
}
