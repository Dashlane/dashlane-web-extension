import { updateToolbarIcon as configUpdateToolbarIcon } from "@dashlane/framework-infra/spi";
import { distinctUntilChanged, filter, map, switchMap } from "rxjs";
import { isSuccess } from "@dashlane/framework-types";
import { AppModules, ClientsOf } from "@dashlane/framework-contracts";
import { AppDefinition } from "@dashlane/application-extension-definition";
import { logger } from "../../logs/app-logger";
async function updateToolbarIcon(isLoggedIn: boolean) {
  try {
    await configUpdateToolbarIcon({ isUserAuthenticated: isLoggedIn });
  } catch (error) {
    logger.error("Failed to update toolbar action icon", { error });
  }
}
export function initToolbarIcon({
  appClient,
}: {
  appClient: ClientsOf<AppModules<AppDefinition>>;
}) {
  const loggedInTask$ = appClient.session.queries.selectedOpenedSession().pipe(
    filter(isSuccess),
    map((c) => !!c.data),
    distinctUntilChanged(),
    switchMap(updateToolbarIcon)
  );
  loggedInTask$.subscribe();
}
