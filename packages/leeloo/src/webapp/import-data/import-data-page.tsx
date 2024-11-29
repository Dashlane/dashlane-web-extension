import { useEffect } from "react";
import { Flex, Heading } from "@dashlane/design-system";
import { Redirect } from "../../libs/router";
import {
  Route,
  Switch,
  useLocation,
  useRouteMatch,
} from "../../libs/router/dom";
import useTranslate from "../../libs/i18n/useTranslate";
import { useFrozenState } from "../../libs/frozen-state/frozen-state-dialog-context";
import { Connected as NotificationsDropdown } from "../bell-notifications/connected";
import { HeaderAccountMenu } from "../components/header/header-account-menu";
import { Header } from "../components/header/header";
import { UpgradeCard } from "./import/upgrade/upgrade-card";
import { ImportDataRoutes } from "./routes";
import { ImportPreview } from "./preview/import-preview";
import { ImportSummary } from "./summary/import-summary";
import { ImportSelect } from "./import/import-select";
import { ImportSource } from "./import/import-source";
import { SecureImport } from "./import/secure-import";
import { ImportPreviewContextProvider } from "./hooks/useImportPreviewContext";
import { ImportSpaceSelect } from "./import/import-space-select";
import { FrozenStateInfobox } from "./import/upgrade/frozen-state-infobox";
import { DirectImport } from "./direct-import/direct-import";
const I18N_KEYS = {
  PAGE_TITLE: "webapp_import_title",
};
export const ImportDataPage = () => {
  const { path } = useRouteMatch();
  const { pathname } = useLocation();
  const { translate } = useTranslate();
  const {
    openDialog: openTrialDiscontinuedDialog,
    shouldShowFrozenStateDialog,
  } = useFrozenState();
  const fullWidthPaths = new Set([`${path}/${ImportDataRoutes.ImportPreview}`]);
  useEffect(() => {
    if (shouldShowFrozenStateDialog) {
      openTrialDiscontinuedDialog();
    }
  }, [shouldShowFrozenStateDialog]);
  return (
    <ImportPreviewContextProvider>
      <Flex
        flexDirection="column"
        sx={{
          backgroundColor: "ds.background.alternate",
          height: "100%",
          overflowY: "scroll",
          flexWrap: "nowrap",
        }}
      >
        <Flex flexDirection="column" sx={{ padding: "16px 24px" }}>
          <Header
            startWidgets={
              <Heading
                as="h1"
                textStyle="ds.title.section.large"
                color="ds.text.neutral.catchy"
              >
                {translate(I18N_KEYS.PAGE_TITLE)}
              </Heading>
            }
            endWidget={
              <>
                <HeaderAccountMenu />
                <NotificationsDropdown />
              </>
            }
          />
        </Flex>
        <Flex flexDirection="column" sx={{ padding: "0px 24px 36px 24px" }}>
          <FrozenStateInfobox />
          <Flex sx={{ gap: "24px" }}>
            <Flex
              flexDirection="column"
              sx={{
                maxWidth: fullWidthPaths.has(pathname) ? "100%" : "500px",
              }}
            >
              <Switch>
                <Route
                  exact={true}
                  path={`${path}/${ImportDataRoutes.ImportSource}`}
                  component={ImportSource}
                />
                <Route
                  path={`${path}/${ImportDataRoutes.ImportSelect}`}
                  component={ImportSelect}
                />
                <Route
                  path={`${path}/${ImportDataRoutes.ImportSpaceSelect}`}
                  component={ImportSpaceSelect}
                />
                <Route
                  path={`${path}/${ImportDataRoutes.SecureImport}`}
                  component={SecureImport}
                />
                <Route
                  path={`${path}/${ImportDataRoutes.ImportPreview}`}
                  component={ImportPreview}
                />
                <Route
                  path={`${path}/${ImportDataRoutes.ImportSummary}`}
                  component={ImportSummary}
                />
                <Route
                  path={`${path}/${ImportDataRoutes.DirectImport}/:source`}
                  component={DirectImport}
                />

                <Redirect
                  exact
                  from="*"
                  to={`${path}/${ImportDataRoutes.ImportSource}`}
                />
              </Switch>
            </Flex>
            <UpgradeCard />
          </Flex>
        </Flex>
      </Flex>
    </ImportPreviewContextProvider>
  );
};
