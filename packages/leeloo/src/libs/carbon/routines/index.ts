import teamAdminNotifications from './teamAdminNotifications';
import { Store } from 'store/create';
const ROUTINE_INTERVAL = 60 * 1000;
const routines: number[] = [];
export function startRoutines(store: Store) {
    teamAdminNotifications(store);
    routines.push(self.setInterval(() => teamAdminNotifications(store), ROUTINE_INTERVAL));
}
export function stopRoutines() {
    routines.forEach((routine) => clearInterval(routine));
}
