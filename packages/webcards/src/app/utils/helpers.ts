import { InputType } from "../communication/types";
export const getStarsRepresentationForHiddenValues = (property: InputType) => {
  switch (property) {
    case InputType.Password:
      return "••••••••••••";
    case InputType.OtpSecret:
      return "••• •••";
    case InputType.CardNumber:
      return "•••• •••• •••• ••••";
    case InputType.SecurityCode:
      return "•••";
    case InputType.BIC:
      return "••••••";
    case InputType.IBAN:
      return "••••••••••••••••";
    default:
      return "••••";
  }
};
