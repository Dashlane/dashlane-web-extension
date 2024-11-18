import { v4 as uuidv4 } from "uuid";
import { StoreService } from "Store";
import { loginDeviceLimitFlow$ } from "Login/DeviceLimit/device-limit-flow.live";
import { pairwise } from "rxjs/operators";
import {
  LoginDeviceLimitFlow,
  LoginDeviceLimitFlowStage,
} from "@dashlane/communication";
export interface ExitEvent {
  type: "exit";
  from: LoginDeviceLimitFlowStage | null;
}
export interface EntryEvent {
  type: "entry";
  to: LoginDeviceLimitFlowStage | null;
}
type EventListener = (event: EntryEvent | ExitEvent) => void;
interface TransitionEventRegistration {
  id: string;
  event: EntryEvent | ExitEvent;
  listener: EventListener;
}
export class DeviceLimitFlowEventsManager {
  private registrations: TransitionEventRegistration[] = [];
  public constructor(storeService: StoreService) {
    const state$ = storeService.getState$();
    state$
      .pipe(loginDeviceLimitFlow$(), pairwise())
      .subscribe(this.onTransition.bind(this));
  }
  public addEventListener(
    event: EntryEvent | ExitEvent,
    listener: EventListener
  ): string {
    const id = uuidv4();
    this.registrations.push({
      id,
      event,
      listener,
    });
    return id;
  }
  public removeTransitionEventListener(id: string) {
    this.registrations = this.registrations.filter(
      (registration) => registration.id !== id
    );
  }
  private onTransition([fromState, toState]: [
    LoginDeviceLimitFlow | null,
    LoginDeviceLimitFlow | null
  ]) {
    this.registrations.forEach(({ event, listener }) => {
      if (
        (event.type === "exit" && event.from === fromState?.name) ||
        (event.type === "entry" && event.to === toState?.name)
      ) {
        listener(event);
      }
    });
  }
}
let instance: DeviceLimitFlowEventsManager;
export const getDeviceLimitFlowEventsManager = (storeService: StoreService) => {
  if (!instance) {
    instance = new DeviceLimitFlowEventsManager(storeService);
  }
  return instance;
};
