import { WebExtensionApiManager } from "@dashlane/autofill-engine/dist/autofill-engine/src/client";
import { AutofillEngineDispatcher } from "@dashlane/autofill-engine/dist/autofill-engine/src/dispatcher";
import { AutofillEngineClientType } from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
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
