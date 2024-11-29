import { WebExtensionApiManager } from "@dashlane/autofill-engine/client";
import { AutofillEngineDispatcher } from "@dashlane/autofill-engine/dispatcher";
import { AutofillEngineClientType } from "@dashlane/autofill-engine/types";
import * as React from "react";
import { UtilsInterface } from ".";
export const useDispatcher = (
  utils: UtilsInterface
): AutofillEngineDispatcher | undefined => {
  const [dispatcher, setDispatcher] =
    React.useState<AutofillEngineDispatcher>();
  React.useEffect(() => {
    setDispatcher(
      utils.connectToDispatcher(
        new WebExtensionApiManager().getBrowserApi(),
        AutofillEngineClientType.Webcards
      )
    );
  }, [utils]);
  return dispatcher;
};
