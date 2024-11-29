import * as React from "react";
import type { Features } from "@dashlane/communication";
import { defaultTheme, ThemeProvider } from "@dashlane/ui-components";
import {
  ColorModeProvider,
  defaultTheme as dsTheme,
  mergeThemes,
  useColorMode,
} from "@dashlane/design-system";
import { DispatcherMessages } from "@dashlane/autofill-engine/dispatcher";
import { WebcardData } from "@dashlane/autofill-engine/types";
import { getLanguage } from "@dashlane/autofill-engine/spi";
import { DismissType } from "@dashlane/hermes";
import { UtilsInterface } from "./utils";
import { useAutofillEngine } from "./utils/useAutofillEngine";
import {
  CloseWebcardFunction,
  FeatureFlips,
  GetInitialStateFunction,
  SendWebcardGeometryFunction,
  WebcardGeometry,
} from "./communication/types";
import { FeatureFlipContextProvider } from "./context/featureFlip";
import { LayoutUtilsContext } from "./context/layoutUtils";
import { I18nContextProvider } from "./context/i18n";
import { PerformanceContextProvider } from "./context/performance";
import { AppWrapper } from "./AppWrapper";
import { useDispatcher } from "./utils/useDispatcher";
import { CommunicationContextProvider } from "./context/communication";
type Props = {
  utils: UtilsInterface;
};
export const DASHLANE_DARK_THEME_KEY = "ds.enableDarkTheme";
const DarkModeWrapper: React.FC = ({ children }) => {
  const [, setColorMode] = useColorMode();
  React.useLayoutEffect(() => {
    const isDarkThemeEnabled = window.localStorage.getItem(
      DASHLANE_DARK_THEME_KEY
    );
    setColorMode(isDarkThemeEnabled === "true" ? "dark" : "light");
  }, [setColorMode]);
  return <>{children}</>;
};
const App = ({ utils }: Props) => {
  const [timeToWebcard, setTimeToWebcard] = React.useState<number | null>(null);
  const [data, setData] = React.useState<
    | (WebcardData & {
        sandboxKey: number;
      })
    | null
  >(null);
  const [getInitialState, setGetInitialState] =
    React.useState<GetInitialStateFunction>(() => () => {
      return;
    });
  const [sendWebcardGeometry, setSendWebcardGeometry] =
    React.useState<SendWebcardGeometryFunction>(() => () => {
      return;
    });
  const [closeWebcard, setCloseWebcard] = React.useState<CloseWebcardFunction>(
    () => () => {
      return;
    }
  );
  const [featureFlips, setFeatureFlips] = React.useState<FeatureFlips>(
    utils.getFromUrl().features ?? {}
  );
  const language: string = React.useMemo(
    () => utils.getFromUrl().langCode || getLanguage(),
    [utils]
  );
  const [autofillEngineCommands, setAutofillEngineActionsHandlers] =
    useAutofillEngine(utils);
  const autofillEngineDispatcher = useDispatcher(utils);
  React.useEffect(() => {
    const webcardId = utils.getFromUrl().token;
    const MAIN_FRAME_ID = 0;
    if (autofillEngineDispatcher && webcardId) {
      const getInitState = async () => {
        const initialData = (await autofillEngineDispatcher.sendMessage(
          {
            message: DispatcherMessages.GetWebcardInitialData,
            targetFrameId: MAIN_FRAME_ID,
          },
          webcardId
        )) as WebcardData;
        if (initialData) {
          utils.clearPlaygroundLogs();
          setData((prevData) => ({
            ...initialData,
            sandboxKey: (prevData?.sandboxKey ?? 0) + 1,
          }));
        }
      };
      getInitState();
      setGetInitialState(() => getInitState);
      setSendWebcardGeometry(
        () => (webcardGeometry: WebcardGeometry) =>
          autofillEngineDispatcher
            .sendMessage(
              {
                message: DispatcherMessages.UpdateWebcardGeometry,
                targetFrameId: MAIN_FRAME_ID,
              },
              webcardId,
              webcardGeometry
            )
            .then((result: number) => {
              if (result) {
                setTimeToWebcard(Number(result));
                autofillEngineDispatcher.sendMessage({
                  message: DispatcherMessages.WebcardOpened,
                });
              }
            })
      );
      setCloseWebcard(() => (dismissType?: DismissType) => {
        autofillEngineDispatcher.sendMessage(
          {
            message: DispatcherMessages.WebcardClosed,
            targetFrameId: MAIN_FRAME_ID,
          },
          webcardId,
          dismissType
        );
        autofillEngineCommands?.webcardClosed(webcardId);
      });
      setAutofillEngineActionsHandlers({
        updateUserFeatureFlips: (features: Features) => {
          setFeatureFlips(features ?? {});
        },
      });
      autofillEngineCommands?.getUserFeatureFlips();
    }
  }, [autofillEngineCommands, autofillEngineDispatcher, utils]);
  if (!data || !autofillEngineCommands || !autofillEngineDispatcher) {
    return null;
  }
  setAutofillEngineActionsHandlers({
    updateWebcard: (webcardData: WebcardData) => {
      if (webcardData.webcardId === data.webcardId) {
        setData({
          ...webcardData,
          sandboxKey: data.sandboxKey,
        });
      }
    },
    closeWebcard: (webcardId: string) => {
      if (webcardId === data.webcardId) {
        closeWebcard();
      }
    },
    updateDomainAnalysisStatus: (analysisEnabled: boolean) => {
      if (!analysisEnabled) {
        closeWebcard();
      }
    },
  });
  return (
    <ThemeProvider theme={mergeThemes(dsTheme, defaultTheme)}>
      <ColorModeProvider>
        <DarkModeWrapper>
          <I18nContextProvider langCode={language}>
            <CommunicationContextProvider
              autofillEngineCommands={autofillEngineCommands}
              autofillEngineDispatcher={autofillEngineDispatcher}
              setAutofillEngineActionsHandlers={
                setAutofillEngineActionsHandlers
              }
            >
              <FeatureFlipContextProvider featureFlips={featureFlips}>
                <PerformanceContextProvider timeToWebcard={timeToWebcard}>
                  <LayoutUtilsContext.Provider
                    value={{
                      sendWebcardGeometry,
                    }}
                  >
                    <AppWrapper
                      utils={utils}
                      data={data}
                      getInitialState={getInitialState}
                      sandboxKey={data.sandboxKey}
                      closeWebcard={closeWebcard}
                    />
                  </LayoutUtilsContext.Provider>
                </PerformanceContextProvider>
              </FeatureFlipContextProvider>
            </CommunicationContextProvider>
          </I18nContextProvider>
        </DarkModeWrapper>
      </ColorModeProvider>
    </ThemeProvider>
  );
};
export { App };
