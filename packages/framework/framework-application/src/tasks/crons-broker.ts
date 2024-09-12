import { concatMap } from "rxjs";
import { Startable } from "../messaging/startable";
import { CronEntry, CronRepository, CronState } from "./cron-repository";
import { CronLowLevelSource, ModuleCronDefinition } from "./cron.types";
import { AppTimers } from "../application/app-timers";
export interface CronRunnerInfrastructure {
  readonly repository: CronRepository;
  readonly timers: AppTimers;
  readonly cronSource: CronLowLevelSource;
}
const ONE_MINUTE = 60000;
function roundMinuteUp(time: number) {
  return Math.ceil(time / ONE_MINUTE) * ONE_MINUTE;
}
function roundMinuteDown(time: number) {
  return Math.floor(time / ONE_MINUTE) * ONE_MINUTE;
}
export class CronsBroker {
  constructor(
    private infra: CronRunnerInfrastructure,
    private definitions: ModuleCronDefinition[]
  ) {}
  public async init(): Promise<void> {
    const now = roundMinuteUp(this.infra.timers.time);
    const inDb = await this.infra.repository.getState();
    const toAdd = this.definitions.filter(
      (d) =>
        !inDb.entries.find(
          (x) => x.name === d.name && x.moduleName === d.moduleName
        )
    );
    const toKeep = inDb.entries.filter((d) =>
      this.definitions.find(
        (x) => x.name === d.name && x.moduleName === d.moduleName
      )
    );
    const state: CronState = {
      entries: [
        ...toKeep,
        ...toAdd.map((x) => {
          const entry: CronEntry = {
            ...x,
            dueTimestamp: now + x.periodInMinutes * ONE_MINUTE,
          };
          return entry;
        }),
      ],
    };
    await this.infra.repository.setState(state);
  }
  public connect(
    cronCallbacks: (module: string, cronName: string) => Promise<boolean>
  ): Startable {
    const { infra, definitions } = this;
    async function runCron(
      now: number,
      state: CronState,
      cronEntry: CronEntry,
      definition: ModuleCronDefinition
    ): Promise<void> {
      let ok = false;
      try {
        ok = await cronCallbacks(cronEntry.moduleName, cronEntry.name);
      } finally {
        if (ok) {
          cronEntry.dueTimestamp = roundMinuteDown(
            now + definition.periodInMinutes * ONE_MINUTE
          );
          await infra.repository.setState(state);
        }
      }
    }
    return {
      start: async () => {
        await this.init();
        const subscription = infra.cronSource.alarm$
          .pipe(
            concatMap(async () => {
              const state = await infra.repository.getState();
              const now = roundMinuteUp(infra.timers.time);
              const nowRoundedDown = roundMinuteDown(infra.timers.time);
              const toRun = state.entries.filter((e) => e.dueTimestamp <= now);
              await Promise.allSettled(
                toRun.map((cron) => {
                  const definition = definitions.find(
                    (c) =>
                      c.moduleName === cron.moduleName && c.name === cron.name
                  );
                  if (!definition) {
                    throw new Error("we should have a declaration");
                  }
                  return runCron(nowRoundedDown, state, cron, definition);
                })
              );
            })
          )
          .subscribe();
        return {
          stop: () => {
            subscription.unsubscribe();
          },
        };
      },
    };
  }
}
