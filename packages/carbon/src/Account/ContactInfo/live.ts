import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { ContactInfo } from "@dashlane/communication";
import { contactInfoSelector } from "Account/ContactInfo/selectors";
import { StateOperator } from "Shared/Live";
export const contactInfo$ = (): StateOperator<ContactInfo> =>
  pipe(map(contactInfoSelector), distinctUntilChanged());
