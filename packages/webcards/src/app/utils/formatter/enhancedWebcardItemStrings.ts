const EnhancedVaultTypeTranslations = {
  passport: {
    MX: "Pasaporte",
    FR: "Passeport",
    DE: "Reisepass",
    ES: "Pasaporte",
    IT: "Passaporto",
    BE: "Passeport",
    NL: "Paspoort",
    AT: "Reisepass",
    DK: "Pas",
    BR: "Passaporte",
    default: "Passport",
  },
  expires: {
    default: "Exp",
  },
  taxNumber: {
    default: "Tax Numbers",
  },
  socialSec: {
    FR: "Sécurité Sociale",
    default: "Social Security Card",
  },
  idCard: {
    FR: "Carte nationale d'identité",
    default: "ID Card",
  },
  driverLicence: {
    FR: "Permis de conduire",
    default: "Driver's Licence",
  },
  months: {
    FR: [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ],
    EN: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    ES: [
      "enero",
      "febrero",
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ],
  },
};
export const cardStrings = {
  getString: function (label: string, language: string) {
    if (!label || !language) {
      return "";
    }
    if (EnhancedVaultTypeTranslations[label][language.toUpperCase()] != null) {
      return EnhancedVaultTypeTranslations[label][language.toUpperCase()];
    }
    return EnhancedVaultTypeTranslations[label]["default"];
  },
  formatDate: function (unformattedDate: string, language = "EN") {
    try {
      const dateElements = unformattedDate.split("-");
      if (dateElements.length < 3) {
        return unformattedDate;
      }
      return `${dateElements[2]} ${
        EnhancedVaultTypeTranslations["months"][language][
          parseInt(dateElements[1], 10) - 1
        ]
      } ${dateElements[0]}`;
    } catch (ex) {
      return unformattedDate;
    }
  },
};
