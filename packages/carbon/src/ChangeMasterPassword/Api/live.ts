import { Subject } from "rxjs";
import { ChangeMasterPasswordProgress } from "@dashlane/communication";
const changeMasterPasswordStatus$ = new Subject<ChangeMasterPasswordProgress>();
export const emitChangeMasterPasswordStatus = (
  params: ChangeMasterPasswordProgress
) => changeMasterPasswordStatus$.next(params);
export const getChangeMasterPasswordStatus$ = () => changeMasterPasswordStatus$;
