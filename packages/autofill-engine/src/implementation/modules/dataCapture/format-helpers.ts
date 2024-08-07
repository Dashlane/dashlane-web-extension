const EMAIL_REGEXP =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
export const isEmail = (value: string): boolean => EMAIL_REGEXP.test(value);
const PHONE_NUMBER_REGEXP = /^[+]?([(]?[0-9]{1,4}[)]?[-\s.]?){1,5}$/;
export const isPhoneNumber = (value: string): boolean =>
  PHONE_NUMBER_REGEXP.test(value);
