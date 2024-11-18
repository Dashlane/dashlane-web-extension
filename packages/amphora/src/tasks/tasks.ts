import { logger } from "../logs/app-logger";
import { DEFAULT_ASYNC_INIT_TIMEOUT_MS, promiseWithTimeout } from "./utils";
export type TaskFn<A, C> = ({
  appClient,
  connectors,
}: {
  appClient: A;
  connectors: C;
}) => void;
type Task<A, C> = {
  name: string;
  fn: TaskFn<A, C>;
};
const runInitTask = (name: string, taskFn: () => void | Promise<void>) => {
  taskFn();
  logger.info(`Executing task "${name}"`);
};
export function makeExtensionInitTasksRunner<A, C>(params: {
  appClient: Promise<A>;
  connectors: C;
}) {
  return {
    withAppClientReady(tasks: Array<Task<A, C>>): void {
      void params.appClient.then((appClient) => {
        tasks.forEach(({ name, fn }) => {
          const promise = Promise.resolve().then(() =>
            runInitTask(name, () => {
              fn({ appClient, connectors: params.connectors });
            })
          );
          void promiseWithTimeout(
            promise,
            DEFAULT_ASYNC_INIT_TIMEOUT_MS,
            () =>
              new Error(
                `Initialization Task ${name} timed out (${DEFAULT_ASYNC_INIT_TIMEOUT_MS}ms)`
              )
          )
            .then(() => {
              logger.info(`${name} task completed`);
            })
            .catch((error) => {
              logger.error(`Initialization Task ${name} failed`, {
                error: error instanceof Error ? error.message : String(error),
              });
              throw error;
            });
        });
      });
    },
    withAppClientPromise(tasks: Array<Task<Promise<A>, C>>): void {
      tasks.forEach((task) => {
        try {
          runInitTask(task.name, () => task.fn(params));
        } catch (error) {
          logger.error(`Error while running task; "${task.name}"`, {
            error: error instanceof Error ? error.message : String(error),
          });
          throw error;
        }
      });
    },
  };
}
