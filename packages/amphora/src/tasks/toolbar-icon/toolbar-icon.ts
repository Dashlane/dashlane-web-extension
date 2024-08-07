import { updateToolbarIcon as configUpdateToolbarIcon } from "@dashlane/framework-infra/spi";
import { logError } from "../../logs/console/logger";
import { TaskDependencies } from "../../tasks/tasks.types";
import { distinctUntilChanged, filter, map, switchMap } from "rxjs";
import { isSuccess } from "@dashlane/framework-types";
async function updateToolbarIcon(isLoggedIn: boolean) {
  try {
    await configUpdateToolbarIcon({ isUserAuthenticated: isLoggedIn });
  } catch (error) {
    logError({
      message: "Failed to update toolbar action icon",
      details: { error },
    });
    throw error;
  }
}
export function initToolbarIcon({
  appClient,
}: Pick<TaskDependencies, "appClient">) {
  const loggedInTask$ = appClient.session.queries.selectedOpenedSession().pipe(
    filter(isSuccess),
    map((c) => !!c.data),
    distinctUntilChanged(),
    switchMap(updateToolbarIcon)
  );
  loggedInTask$.subscribe();
}
