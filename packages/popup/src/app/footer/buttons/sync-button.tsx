import * as React from "react";
import { Button, jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import { Trigger } from "@dashlane/hermes";
import lottie, {
  AnimationConfigWithData,
  AnimationItem,
} from "lottie-web/build/player/lottie_light";
import { SyncStatuses } from "@dashlane/communication";
import { useModuleCommands } from "@dashlane/framework-react";
import { syncApi } from "@dashlane/sync-contracts";
import loadingAnimationData from "../../../animation-data/sync/loading.json";
import successAnimationData from "../../../animation-data/sync/success.json";
import failureAnimationData from "../../../animation-data/sync/failure.json";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useSyncStatus } from "../../../libs/hooks/useSyncStatus";
export const SYNC_REQUEST_DELAY = 200;
const I18N_KEYS = {
  MANUAL_SYNC_TOOLTIP: "footer_manual_sync_tooltip",
};
const SX_STYLES: {
  [key: string]: ThemeUIStyleObject;
} = {
  CONTAINER: {
    display: "flex",
    justifyContent: "center",
  },
};
type SyncAnimationConfigWithData = Omit<
  AnimationConfigWithData,
  "container" | "animationData"
> & {
  animationData: unknown;
};
const ANIMATIONS_CONFIGS: Record<SyncStatuses, SyncAnimationConfigWithData> = {
  [SyncStatuses.READY]: {
    animationData: loadingAnimationData,
    loop: true,
    autoplay: false,
  },
  [SyncStatuses.IN_PROGRESS]: {
    animationData: loadingAnimationData,
    loop: true,
    autoplay: true,
  },
  [SyncStatuses.SUCCESS]: {
    animationData: successAnimationData,
    loop: false,
    autoplay: true,
  },
  [SyncStatuses.FAILURE]: {
    animationData: failureAnimationData,
    loop: false,
    autoplay: true,
  },
};
export const SyncButton = () => {
  const { translate } = useTranslate();
  const { sync } = useModuleCommands(syncApi);
  const { watchNextSync, status } = useSyncStatus();
  const container = React.useRef<HTMLDivElement>(null);
  const item = React.useRef<AnimationItem>();
  const syncButtonRef = React.useRef<HTMLButtonElement>(null);
  const isSyncInProgress = status === SyncStatuses.IN_PROGRESS;
  const syncTimeout = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (isSyncInProgress) {
      syncButtonRef.current?.blur();
    }
    return () => {
      if (syncTimeout.current) {
        window.clearTimeout(syncTimeout.current);
      }
    };
  }, [isSyncInProgress, syncTimeout]);
  React.useLayoutEffect(() => {
    if (!container.current) {
      return;
    }
    item.current?.destroy();
    item.current = lottie.loadAnimation({
      container: container.current,
      ...ANIMATIONS_CONFIGS[status || SyncStatuses.READY],
    });
  }, [status, container]);
  const handleManualSync = () => {
    if (!syncTimeout.current) {
      syncTimeout.current = window.setTimeout(() => {
        syncTimeout.current = null;
        watchNextSync();
        sync({ trigger: Trigger.Manual });
      }, SYNC_REQUEST_DELAY);
    }
  };
  return (
    <Button
      title={translate(I18N_KEYS.MANUAL_SYNC_TOOLTIP)}
      aria-label={translate(I18N_KEYS.MANUAL_SYNC_TOOLTIP)}
      mood="neutral"
      layout="iconOnly"
      icon={<div sx={SX_STYLES.CONTAINER} ref={container} />}
      intensity="supershy"
      onClick={handleManualSync}
      disabled={isSyncInProgress}
      ref={syncButtonRef}
    />
  );
};
