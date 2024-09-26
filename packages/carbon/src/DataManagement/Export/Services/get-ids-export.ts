import {
  DriverLicense,
  FiscalId,
  IdCard,
  Identity,
  Passport,
  SocialSecurityId,
} from "@dashlane/communication";
import { identityToName } from "DataManagement/Ids/helpers";
import { PersonalDataVaultItems } from "DataManagement/types";
import { handleSpecialCharacter } from "./handle-special-character";
import { formatDataToCSV, formatHeader } from "./helpers";
export function getIdsExport(personalData: PersonalDataVaultItems): string {
  const identitiesMap = new Map<string, Identity>();
  personalData.identities.forEach((identity) => {
    identitiesMap.set(identity.Id, identity);
  });
  const idCardsData = personalData.idCards;
  const passportsData = personalData.passports;
  const driverLicensesData = personalData.driverLicenses;
  const socialSecurityData = personalData.socialSecurityIds;
  const taxNumberData = personalData.fiscalIds;
  const metaData = [
    { headerKey: "type", dataKey: "type" },
    { headerKey: "number", dataKey: "Number" },
    { headerKey: "name", dataKey: "Fullname" },
    { headerKey: "issue_date", dataKey: "DeliveryDate" },
    { headerKey: "expiration_date", dataKey: "ExpireDate" },
    { headerKey: "place_of_issue", dataKey: "DeliveryPlace" },
    { headerKey: "state", dataKey: "State" },
  ];
  const filterIdCardsData = (idCardsData: IdCard[]) => {
    return idCardsData.map((card) => {
      const cardIdentity = identitiesMap.get(card.LinkedIdentity);
      return metaData
        .map((cardData) => {
          const filteredValue = `${card[cardData.dataKey] ?? ""}`;
          if (cardData.dataKey === "type") {
            return "card";
          }
          if (cardData.dataKey === "Fullname" && cardIdentity) {
            const idCardName = identityToName(cardIdentity) ?? filteredValue;
            return handleSpecialCharacter(idCardName);
          }
          return handleSpecialCharacter(filteredValue);
        })
        .join(",");
    });
  };
  const formatIdCardsData = (idCardsData: IdCard[]): string => {
    return filterIdCardsData(idCardsData).join("\r\n");
  };
  const filterPassportsData = (passportsData: Passport[]) => {
    return passportsData.map((passport) => {
      const passportIdentity = identitiesMap.get(passport.LinkedIdentity);
      return metaData
        .map((passportData) => {
          const filteredValue = `${passport[passportData.dataKey] ?? ""}`;
          if (passportData.dataKey === "type") {
            return "passport";
          }
          if (passportData.dataKey === "Fullname" && passportIdentity) {
            const passportName =
              identityToName(passportIdentity) ?? filteredValue;
            return handleSpecialCharacter(passportName);
          }
          return handleSpecialCharacter(filteredValue);
        })
        .join(",");
    });
  };
  const formatPassportsData = (passportsData: Passport[]): string => {
    return filterPassportsData(passportsData).join("\r\n");
  };
  const filterDriverLicensesData = (driverLicensesData: DriverLicense[]) => {
    return driverLicensesData.map((license) => {
      const licenseIdentity = identitiesMap.get(license.LinkedIdentity);
      return metaData
        .map((licenseData) => {
          const filteredValue = `${license[licenseData.dataKey] ?? ""}`;
          if (licenseData.dataKey === "type") {
            return "license";
          }
          if (licenseData.dataKey === "Fullname" && licenseIdentity) {
            const licenseName =
              identityToName(licenseIdentity) ?? filteredValue;
            return handleSpecialCharacter(licenseName);
          }
          return handleSpecialCharacter(filteredValue);
        })
        .join(",");
    });
  };
  const formatDriverLicensesData = (
    driverLicensesData: DriverLicense[]
  ): string => {
    return filterDriverLicensesData(driverLicensesData).join("\r\n");
  };
  const filterSocialSecurityData = (socialSecurityData: SocialSecurityId[]) => {
    return socialSecurityData.map((ssId) => {
      const ssIdIdentity = identitiesMap.get(ssId.Id);
      return metaData
        .map((ssIdData) => {
          const filteredValue = `${ssId[ssIdData.dataKey] ?? ""}`;
          if (ssIdData.dataKey === "type") {
            return "social_security";
          }
          if (ssIdData.dataKey === "Number") {
            const value = ssId["SocialSecurityNumber"];
            return handleSpecialCharacter(value);
          }
          if (ssIdData.dataKey === "Fullname") {
            const ssIdName = ssIdIdentity
              ? identityToName(ssIdIdentity)
              : ssId["SocialSecurityFullname"];
            return handleSpecialCharacter(ssIdName);
          }
          return handleSpecialCharacter(filteredValue);
        })
        .join(",");
    });
  };
  const formatSocialSecurityData = (
    socialSecurityData: SocialSecurityId[]
  ): string => {
    return filterSocialSecurityData(socialSecurityData).join("\r\n");
  };
  const filterTaxNumberData = (taxNumberData: FiscalId[]) => {
    return taxNumberData.map((card) => {
      return metaData
        .map((cardData) => {
          const filteredValue = `${card[cardData.dataKey] ?? ""}`;
          if (cardData.dataKey === "type") {
            return handleSpecialCharacter("tax_number");
          } else if (cardData.dataKey === "Number") {
            const value = card["FiscalNumber"];
            return handleSpecialCharacter(value);
          } else {
            const value = `${filteredValue}`;
            return handleSpecialCharacter(value);
          }
        })
        .join(",");
    });
  };
  const formatTaxNumberData = (taxNumberData: FiscalId[]): string => {
    return filterTaxNumberData(taxNumberData).join("\r\n");
  };
  return formatDataToCSV([
    formatHeader(metaData),
    formatIdCardsData(idCardsData),
    formatPassportsData(passportsData),
    formatDriverLicensesData(driverLicensesData),
    formatSocialSecurityData(socialSecurityData),
    formatTaxNumberData(taxNumberData),
  ]);
}
