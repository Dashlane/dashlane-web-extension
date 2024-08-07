import * as carbon from "@dashlane/carbon";
export const getDashlaneApiOverrides =
  (): Partial<carbon.DashlaneAPISchemes> => {
    const dashlaneApiOverrides = {
      [carbon.DashlaneAPISchemesNames.DASHLANE_API_HOST_WITH_SCHEME]:
        DASHLANE_API_ADDRESS,
      [carbon.DashlaneAPISchemesNames.DASHLANE_WS_HOST_WITH_SCHEME]:
        DASHLANE_WS_ADDRESS,
    };
    return Object.fromEntries(
      Object.entries(dashlaneApiOverrides).filter(([, value]) => value)
    );
  };
