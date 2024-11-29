const EU_VAT_NUMBER_REGEX =
  /^((AT)(U\d{8})|(BE)(0\d{9}|\d{10})|(BG)(\d{9,10})|(CHE)(\d{9})|(CY)(\d{8}[A-Z])|(CZ)(\d{8,10})|(DE)(\d{9})|(DK)(\d{8})|(EE)(\d{9})|(GB)(\d{5,12})|(EL|GR)(\d{9})|(ES)([\dA-Z]\d{7}[\dA-Z])|(FI)(\d{8})|(FR)([\dA-Z]{2}\d{9})|(HU)(\d{8})|(HR)(\d{11})|(IE)(\d{7}[A-Z]{1,2})|(IT)(\d{11})|(LT)(\d{9}|\d{12})|(LU)(\d{8})|(LV)(\d{11})|(MT)(\d{8})|(NL)(\d{9}(B\d{2}|BO2))|(PL)(\d{10})|(PT)(\d{9})|(RO)(\d{2,10})|(SE)(\d{12})|(SI)(\d{8})|(SK)(\d{10})|(\d{9}MVA))$/i;
export const validateEUVATNumber = (vatNumber: string) => {
  const strippedValue = vatNumber.replaceAll(/\./g, "");
  return EU_VAT_NUMBER_REGEX.test(strippedValue);
};
