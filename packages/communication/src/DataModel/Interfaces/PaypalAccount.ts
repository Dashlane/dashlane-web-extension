import * as Common from "./Common";
export interface PaypalAccount extends Common.DataModelObject {
  Name: string;
  Login: string;
  Password: string;
  PersonalNote: string;
}
export function isPaypalAccount(
  o: Common.BaseDataModelObject
): o is PaypalAccount {
  return Boolean(o) && o.kwType === "KWPaymentMean_paypal";
}
