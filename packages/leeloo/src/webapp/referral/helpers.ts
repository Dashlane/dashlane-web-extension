import { EMAIL_REGEX } from 'libs/validators';
export function splitEmails(emails: string) {
    return emails.split(',').map((email) => email.trim());
}
export function filterInvalidEmails(emails: string[]) {
    return emails.filter((email) => !EMAIL_REGEX.test(email));
}
